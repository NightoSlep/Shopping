import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Product } from './product/entities/product.entity';
import { User, UserRole } from './user/entities/user.entity';
import { Order } from './orders/entities/order.entity';
import { OrderDetail } from './orders/entities/order-detail.entity';
import { DataSource } from 'typeorm';
import { Category } from './category/entities/category.entity';
import { Banner } from './banner/entities/banner.entity';
import * as bcrypt from 'bcrypt';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Xoá dữ liệu cũ
  await dataSource.getRepository(OrderDetail).delete({});
  await dataSource.getRepository(Order).delete({});
  await dataSource.getRepository(Product).delete({});
  await dataSource.getRepository(Category).delete({});
  await dataSource.getRepository(User).delete({});
  await dataSource.getRepository(Banner).delete({});

  // Banner
  await dataSource.getRepository(Banner).save([
    {
      name: 'Siêu Sale Mùa Hè',
      url: 'https://example.com/images/banner1.jpg',
    },
    {
      name: 'Mừng Sinh Nhật Shop',
      url: 'https://example.com/images/banner2.jpg',
    },
    {
      name: 'Giảm Giá Cực Mạnh',
      url: 'https://example.com/images/banner3.jpg',
    },
  ]);

  // Danh mục
  const categories = await dataSource
    .getRepository(Category)
    .save([
      { category_name: 'Điện thoại' },
      { category_name: 'Máy tính bảng' },
      { category_name: 'Phụ kiện' },
    ]);

  // Sản phẩm
  const imageUrls = [
    'https://example.com/images/iphone15.jpg',
    'https://example.com/images/galaxy-s24.jpg',
    'https://example.com/images/sony-whch520.jpg',
    'https://example.com/images/oppo-reno10.jpg',
    'https://example.com/images/vivo-v30.jpg',
    'https://example.com/images/anker-cable.jpg',
    'https://example.com/images/nokia-xr21.jpg',
    'https://example.com/images/asus-rog7.jpg',
    'https://example.com/images/iphone15-case.jpg',
    'https://example.com/images/huawei-p60.jpg',
  ];

  const sampleProductNames = [
    'iPhone 15',
    'Samsung Galaxy S24',
    'Tai nghe Bluetooth Sony WH-CH520',
    'Oppo Reno 10',
    'Vivo V30',
    'Cáp sạc nhanh Anker PowerLine',
    'Nokia XR21',
    'Asus ROG Phone 7',
    'Ốp lưng iPhone 15 Silicon Case',
    'Huawei P60 Pro',
  ];

  const products = await dataSource.getRepository(Product).save(
    sampleProductNames.map((name, index) => ({
      productName: name,
      price: randomInt(800_000, 3_000_000),
      quantity: randomInt(20, 100),
      image: imageUrls[index],
      category: categories[index % categories.length],
    })),
  );

  const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  // Người dùng
  const users = await dataSource.getRepository(User).save([
    {
      username: 'admin',
      accountName: 'Quản trị viên',
      email: 'admin@gmail.com',
      phone: '0123456789',
      password: await hashPassword('admin'),
      role: UserRole.ADMIN,
    },
    ...await Promise.all(
      Array.from({ length: 4 }).map(async (_, i) => ({
        username: `user${i + 1}`,
        accountName: `Người dùng ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        phone: `09${randomInt(10000000, 99999999)}`,
        password: await hashPassword('123456'),
        role: UserRole.USER,
      })),
    ),
  ]);

  // Đơn hàng
  const orders = await dataSource.getRepository(Order).save(
    Array.from({ length: 10 }).map(() => ({
      user: users[randomInt(1, users.length - 1)],
      totalAmount: 0,
      paymentMethod: 'momo',
      createdAt: randomDate(new Date('2025-01-01'), new Date('2025-06-28')),
    })),
  );

  // Chi tiết đơn hàng
  const orderDetails: Partial<OrderDetail>[] = [];
  for (const order of orders) {
    const count = randomInt(1, 3);
    const used = new Set<number>();

    for (let i = 0; i < count; i++) {
      let idx: number;
      do {
        idx = randomInt(0, products.length - 1);
      } while (used.has(idx));
      used.add(idx);

      const product = products[idx];
      const qty = randomInt(1, 5);

      orderDetails.push({
        order,
        orderId: order.orderId,
        product,
        productId: product.id,
        quantity: qty,
        unitPrice: product.price,
        totalPrice: product.price * qty,
      });
    }
  }

  await dataSource.getRepository(OrderDetail).save(orderDetails);

  for (const order of orders) {
    const total = orderDetails
      .filter((d) => (d.order as Order).orderId === order.orderId)
      .reduce((sum, d) => sum + Number(d.totalPrice), 0);

    await dataSource.getRepository(Order).update(order.orderId, {
      totalAmount: total,
    });
  }

  console.log('✅ Seed data thành công!');
  await app.close();
}

bootstrap();
