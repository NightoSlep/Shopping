import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { OrderDetail } from '../entities/order-detail.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDetailDto): Promise<OrderDetail> {
    const order = await this.orderRepo.findOne({
      where: { orderId: dto.orderId },
    });
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!order || !product) {
      throw new NotFoundException('Order or Product not found');
    }

    const totalPrice = dto.unitPrice * dto.quantity;

    const detail = this.orderDetailRepo.create({
      order,
      product,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      totalPrice,
    });

    return await this.orderDetailRepo.save(detail);
  }

  async findByOrder(orderId: string): Promise<OrderDetail[]> {
    return this.orderDetailRepo.find({
      where: { order: { orderId } },
      relations: ['product'],
    });
  }
}
