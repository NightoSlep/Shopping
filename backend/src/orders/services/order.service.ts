import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OpenOrderDetail } from '../dto/open-order-detail.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<Order> {
    const { paymentMethod, orderDetails } = createOrderDto;

    let totalAmount = 0;
    const productMap = new Map<string, Product>();

    for (const detail of orderDetails) {
      const product = await this.productRepository.findOneBy({
        id: detail.productId,
      });
      if (!product) {
        throw new NotFoundException(`Product ${detail.productId} not found`);
      }
      if (product.quantity < detail.quantity) {
        throw new BadRequestException(
          `Not enough quantity for product ${product.productName}`,
        );
      }
      productMap.set(detail.productId, product);
      totalAmount += product.price * detail.quantity;
    }

    const order = this.orderRepository.create({
      userId,
      totalAmount,
      paymentMethod,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const detail of orderDetails) {
      const product = productMap.get(detail.productId)!;
      product.quantity -= detail.quantity;
      await this.productRepository.save(product);

      const orderDetail = this.orderDetailRepository.create({
        orderId: savedOrder.orderId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: product.price,
        totalPrice: product.price * detail.quantity,
      });
      await this.orderDetailRepository.save(orderDetail);
    }

    return this.getOrderById(savedOrder.orderId);
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getOrderDetailsSecure(
    orderId: string,
    userId: string,
  ): Promise<OpenOrderDetail[]> {
    const order = await this.orderRepository.findOneBy({ orderId });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) {
      throw new UnauthorizedException('You can only view your own orders');
    }
    const details = await this.fetchOrderDetailWithProduct(orderId);
    return details.map(this.mapDetailRowToDTO);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderDetailsByAdmin(orderId: string): Promise<OpenOrderDetail[]> {
    const order = await this.orderRepository.findOneBy({ orderId });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const details = await this.fetchOrderDetailWithProduct(orderId);
    return details.map(this.mapDetailRowToDTO);
  }

  async updateOrderById(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ orderId });
    if (!order) throw new NotFoundException('Order not found');

    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async deleteOrderById(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOneBy({ orderId });
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepository.delete(orderId);
  }

  async updateOrderStatusByAdmin(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ orderId });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const validStatuses = [
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELED,
    ];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELED
    ) {
      throw new BadRequestException(
        'Cannot update a finalized or canceled order',
      );
    }
    order.status = status;
    return this.orderRepository.save(order);
  }

  async cancelOrderByUser(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ orderId });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new UnauthorizedException('You can only cancel your own orders');
    }

    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException('Order cannot be canceled at this stage');
    }

    order.status = OrderStatus.CANCELED_BY_CUSTOMER;
    return this.orderRepository.save(order);
  }

  private async fetchOrderDetailWithProduct(orderId: string) {
    return this.orderDetailRepository
      .createQueryBuilder('detail')
      .leftJoinAndSelect('detail.product', 'product')
      .where('detail.orderId = :orderId', { orderId })
      .select([
        'detail.orderDetailId',
        'detail.productId',
        'detail.quantity',
        'detail.unitPrice',
        'detail.totalPrice',
      ])
      .addSelect('product.productName', 'product_productName')
      .getRawMany();
  }

  private mapDetailRowToDTO = (row: OrderDetail): OpenOrderDetail => ({
    orderDetailId: row.orderDetailId,
    productId: row.productId,
    quantity: row.quantity,
    unitPrice: row.unitPrice,
    totalPrice: row.totalPrice,
    productName: row.productId,
  });
}
