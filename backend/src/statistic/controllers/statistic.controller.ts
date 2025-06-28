import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from '../services/statistic.service';

@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('overview')
  getOverview() {
    return this.statisticService.getOverview();
  }

  @Get('revenue')
  getRevenue(@Query('range') range: 'week' | 'month' | 'year') {
    return this.statisticService.getRevenueByRange(range);
  }

  @Get('top-products')
  getTopProducts() {
    return this.statisticService.getTopSellingProducts();
  }
}
