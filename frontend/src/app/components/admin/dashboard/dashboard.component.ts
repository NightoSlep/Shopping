import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StatisticService } from '../../../services/admin/statistic/statistic.service';

@Component({
  selector: 'app-dashboard',
  imports: [
          NgChartsModule,   
          MatTableModule,
          MatCardModule,
          MatToolbarModule,
          CommonModule,
          NgFor,
          FormsModule,
          MatButtonToggleModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  statistics: { label: string; value: number | string }[] = [];
  selectedRange: 'week' | 'month' | 'year' = 'month';

  revenueLabels: string[] = [];

  revenueData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        data: [],
        backgroundColor: 'rgba(63, 81, 181, 0.7)'
      }
    ]
  };

  revenueOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  topProducts: { name: string; sold: number }[] = [];
  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.loadOverview();
    this.loadRevenue();
    this.loadTopProducts();
  }

  loadOverview() {
    this.statisticService.getOverview().subscribe(res => {
      this.statistics = [
        { label: 'Tổng sản phẩm', value: res.totalProducts },
        { label: 'Tổng đơn hàng', value: res.totalOrders },
        { label: 'Doanh thu (VND)', value: res.totalRevenue.toLocaleString() },
        { label: 'Khách hàng', value: res.totalCustomers }
      ];
    });
  }

  loadRevenue() {
    this.statisticService.getRevenue(this.selectedRange).subscribe(res => {
      console.log('Revenue response:', res); // kiểm tra
      this.revenueLabels = res.labels;
      this.revenueData = {
        labels: this.revenueLabels,
        datasets: [
          {
            label: 'Doanh thu',
            data: res.data,
            backgroundColor: 'rgba(63, 81, 181, 0.7)'
          }
        ]
      };
    });
  }

  loadTopProducts() {
    this.statisticService.getTopProducts().subscribe(res => {
      console.log('Top products:', res);
      this.topProducts = res;
    });
  }

  onRangeChange() {
    this.loadRevenue();
  }
}
