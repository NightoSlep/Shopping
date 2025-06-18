import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { Banner } from '../entities/banner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.bannerRepository.delete(id);
  }
}
