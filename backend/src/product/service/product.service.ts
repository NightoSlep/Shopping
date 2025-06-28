import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = dto;
    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const product = this.productRepo.create({ ...rest, category });
    return this.productRepo.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { categoryId, ...rest } = dto;
    const product = await this.productRepo.preload({
      id,
      ...rest,
    });

    if (!product) throw new NotFoundException('Product not found');
    if (categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: categoryId });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }
    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
  async getTopSellingProducts(limit = 5) {
    return this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.orderDetails', 'orderDetail')
      .select('product.id', 'id')
      .addSelect('product.productName', 'name')
      .addSelect('SUM(orderDetail.quantity)', 'sold')
      .groupBy('product.id')
      .orderBy('sold', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
