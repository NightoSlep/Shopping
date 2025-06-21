import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OpenOrderDetail, Order, OrderItem } from '../../../../models/order.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/admin/user/user.service';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../../../services/admin/order/order.service';

@Component({
  selector: 'app-order-detail-dialog',
  imports: [MatDialogModule, CommonModule, MatButtonModule],
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.css'
})
export class OrderDetailDialogComponent implements OnInit{
  username: string = 'Đang tải...';
  orderItems: OpenOrderDetail[] = [];
  statusLabels: { [key: string]: string } = {
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao',
    completed: 'Hoàn thành',
    canceled: 'Admin đã hủy',
    canceledbycustomer: 'Khách đã hủy',
  };

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { order: Order },
      public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
      private userService: UserService,
      private orderService: OrderService
    ) {}

  ngOnInit(): void {
    const userId = this.data.order.userId;
    const orderId = this.data.order.orderId;

    if (userId) {
      this.userService.getUserName(userId).subscribe({
        next: (res) => (this.username = res.username),
        error: () => (this.username = 'Không xác định'),
      });
    } else {
      this.username = 'Không xác định';
    }

    this.orderService.getOrderDetailById(orderId).subscribe({
      next: (res) => {
        this.orderItems = res;
        console.log('Chi tiết sản phẩm trong đơn hàng:', res);
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
      }
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status.toLowerCase()] || status;
  }
}
