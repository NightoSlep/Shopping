import { IsUUID } from 'class-validator';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  PROCESSING = 'Processing',
  SHIPPING = 'Shipping',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
  CANCELED_BY_CUSTOMER = 'CanceledByCustomer',
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
