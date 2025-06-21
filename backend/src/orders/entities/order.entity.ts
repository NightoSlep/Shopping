import { IsUUID } from 'class-validator';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  CANCELED_BY_CUSTOMER = 'canceledbycustomer',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @IsUUID()
  @Column('uuid')
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  paymentMethod: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PROCESSING,
  })
  status: OrderStatus;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
