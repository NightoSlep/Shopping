import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { Banner } from '../entities/banner.entity';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  findAll(): Promise<Banner[]> {
    return this.bannerService.findAll();
  }

  @Post()
  createBanner(@Body() createBannerDto: CreateBannerDto): Promise<Banner> {
    return this.bannerService.create(createBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.bannerService.remove(id);
  }
}
