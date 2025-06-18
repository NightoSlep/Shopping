import { Category } from 'src/category/entities/category.entity';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_name', type: 'varchar', nullable: false })
  productName: string;

  @Column('decimal')
  price: number;

  @Column('int', { nullable: false })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];
}
