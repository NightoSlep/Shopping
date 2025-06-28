import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderDetail } from '../../orders/entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private customerRepo: Repository<User>,
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,
  ) {}

  async getOverview() {
    const totalProducts = await this.productRepo.count();
    const totalOrders = await this.orderRepo.count();
    const totalCustomers = await this.customerRepo.count();

    const totalRevenueResult: TotalRevenueRaw | undefined =
      await this.orderDetailRepo
        .createQueryBuilder('detail')
        .select('SUM(detail.totalPrice)', 'total')
        .getRawOne();

    const totalRevenue = parseInt(totalRevenueResult?.total ?? '0', 10);
    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
    };
  }

  async getRevenueByRange(
    range: 'week' | 'month' | 'year',
  ): Promise<{ labels: string[]; data: number[] }> {
    let groupByFormat: string;
    switch (range) {
      case 'week':
        groupByFormat = 'IYYY-IW';
        break;
      case 'month':
        groupByFormat = 'YYYY-MM';
        break;
      case 'year':
        groupByFormat = 'YYYY';
        break;
    }
    const data: RevenueRaw[] = await this.orderDetailRepo
      .createQueryBuilder('detail')
      .leftJoin('detail.order', 'order')
      .select(`TO_CHAR(order.createdAt, '${groupByFormat}')`, 'label')
      .addSelect('SUM(detail.totalPrice)', 'total')
      .groupBy('label')
      .orderBy('label', 'ASC')
      .getRawMany();
    return {
      labels: data.map((d) => d.label),
      data: data.map((d) => parseInt(d.total, 10) || 0),
    };
  }

  async getTopSellingProducts() {
    const data: TopProductRaw[] = await this.orderDetailRepo
      .createQueryBuilder('detail')
      .innerJoin('detail.product', 'product')
      .select('product.product_name', 'name')
      .addSelect('SUM(detail.quantity)', 'sold')
      .groupBy('product.product_name')
      .orderBy('sold', 'DESC')
      .limit(5)
      .getRawMany();

    return data.map((item) => ({
      name: item.name ?? 'Không rõ',
      sold: parseInt(item.sold) || 0,
    }));
  }
}
