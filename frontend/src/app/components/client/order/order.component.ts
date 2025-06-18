import { Component, OnDestroy, OnInit } from '@angular/core';
import { OpenOrderDetail, Order } from '../../../models/order.model';
import { OrderService } from '../../../services/client/order/order.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-order',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy{
  orders: Order[] = [];
  selectedOrderItems: OpenOrderDetail[] = [];
  selectedOrderMeta: Order | null = null;

  currentPage: number = 1;
  
  stepOrder: string[] = ['processing', 'shipping', 'delivered', 'completed'];

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.selectedOrderMeta) {
      this.closeOrderDetail();
    }
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe(data => {
      this.orders = data;
    });

    window.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  openOrderDetail(orderId: string) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) return;

    this.orderService.getDetailOrderById(orderId).subscribe(data => {
      this.selectedOrderItems = data;
      this.selectedOrderMeta = order;
    });
  }

  closeOrderDetail() {
    this.selectedOrderItems = [];
    this.selectedOrderMeta = null;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      processing: '🛠️ Đang xử lý',
      shipping: '🚚 Đang giao hàng',
      delivered: '📦 Đã giao',
      completed: '✅ Hoàn thành',
      canceled: '❌ Admin Đã hủy',
      canceledbycustomer: '❌ Khách đã hủy',
    };
    return statusMap[status?.trim().toLowerCase()] || '❓ Không rõ';
  }

  getStepStatusClass(step: string): string {
    if (!this.selectedOrderMeta) return 'step-upcoming';
    const currentIndex = this.stepOrder.indexOf(this.selectedOrderMeta.status.toLowerCase());
    const stepIndex = this.stepOrder.indexOf(step.toLowerCase());

    if (stepIndex < currentIndex) return 'step-passed';
    if (stepIndex === currentIndex) return 'step-current';
    return 'step-upcoming';
  }
}
