import { Module } from '@nestjs/common';
import { StatisticController } from './controllers/statistic.controller';
import { StatisticService } from './services/statistic.service';
import { User } from 'src/user/entities/user.entity';
import { OrderDetail } from 'src/orders/entities/order-detail.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, OrderDetail, User])],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
