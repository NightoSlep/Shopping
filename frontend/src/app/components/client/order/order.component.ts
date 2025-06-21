import { Component, OnDestroy, OnInit } from '@angular/core';
import { OpenOrderDetail, Order } from '../../../models/order.model';
import { OrderService } from '../../../services/client/order/order.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-order',
  imports: [CommonModule, NgxPaginationModule, MatDialogModule],
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

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

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

  canCancelOrder(status: string | undefined): boolean {
    if (!status) return false;
    const s = status.toLowerCase();
    return !['canceled', 'canceledbycustomer', 'completed', 'delivered', 'shipping'].includes(s);
  }

  cancelMyOrder(orderId: string, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Xác nhận hủy đơn hàng',
          message: `Bạn có chắc chắn muốn hủy đơn hàng "${orderId}"?`,
          confirmText: 'Hủy đơn',
          cancelText: 'Thoát'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.cancelOrder(orderId).subscribe({
          next: () => {
            const index = this.orders.findIndex(o => o.orderId === orderId);
            if (index !== -1) {
              this.orders[index].status = 'canceledbycustomer';
            }
          },
          error: () => {
            this.dialog.open(ConfirmDialogComponent, {
              width: '300px',
              data: {
                title: 'Lỗi',
                message: '❌ Có lỗi xảy ra khi hủy đơn hàng.',
                confirmText: 'Đóng',
                hideCancel: true
              }
            });
          }
        });
      }
    });
  }
}
