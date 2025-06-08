import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from 'src/orders/controllers/order.controller';
import { OrderService } from 'src/orders/services/order.service';
import { OrderDetail } from './entities/order-detail.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail, Order, Product])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderDetailModule {}
