import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order, OrderWithUsername } from '../../../models/order.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrderService } from '../../../services/admin/order/order.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderDetailDialogComponent } from './order-detail-dialog/order-detail-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/admin/user/user.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-order',
  imports: [
      MatPaginatorModule, 
      CommonModule, 
      MatIconModule, 
      MatTableModule,
      MatButtonModule, 
      MatToolbarModule, 
      MatFormFieldModule, 
      FormsModule,
      MatInputModule,
      MatDialogModule,
      MatSelectModule,],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class AdminOrderComponent implements OnInit, AfterViewInit{
  orders: Order[] = [];
  displayedColumns: string[] = [
    'stt',
    'orderId',
    'customerName',
    'createdAt',
    'status',
    'totalAmount',
    'actions'
  ];
  orderStatuses: string[] = [
    'processing',
    'shipping',
    'delivered',
    'completed',
    'canceled',
    'canceledbycustomer'
  ];

  statusLabels: { [key: string]: string } = {
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao',
    completed: 'Hoàn thành',
    canceled: 'Admin hủy',
    canceledbycustomer: 'Khách hủy',
  };

  dataSource = new MatTableDataSource<OrderWithUsername>();
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrderService, private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.loadOrders();
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((orders) => {
      const userRequests = orders.map((order) =>
        order.userId
          ? this.userService.getUserName(order.userId).pipe(
              map((res) => ({ ...order, username: res.username })),
              catchError(() => of({ ...order, username: 'Không xác định' }))
            )
          : of({ ...order, username: 'Không xác định' })
      );

      forkJoin(userRequests).subscribe((ordersWithUsername: OrderWithUsername[]) => {
        this.orders = ordersWithUsername;
        this.dataSource = new MatTableDataSource<OrderWithUsername>(ordersWithUsername);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: OrderWithUsername, filter: string) =>
          data.orderId.toLowerCase().includes(filter.trim().toLowerCase()) ||
          (data.username || '').toLowerCase().includes(filter.trim().toLowerCase());
      });
    });
  }

  onSearch(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetail(order: Order): void {
    this.dialog.open(OrderDetailDialogComponent, {
      width: '450px',
      data: { order },
    });
  }

  isStatusLocked(status: string): boolean {
    const normalizedStatus = status.trim().toLowerCase();
    const lockedStatus = ['completed', 'canceledbycustomer', 'canceled'];
    return lockedStatus.includes(normalizedStatus);
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status.toLowerCase()] || status;
  }

  cancelOrder(order: Order): void {
    const normalizedStatus = order.status.trim().toLowerCase();
    const notCancelableStatuses = ['completed', 'canceledbycustomer', 'canceled', 'delivered'];

    if (notCancelableStatuses.includes(normalizedStatus)) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Xác nhận hủy đơn hàng',
        message: `Bạn có chắc chắn muốn hủy đơn hàng "${order.orderId}"?`,
        confirmText: 'Hủy đơn',
        cancelText: 'Thoát'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.cancelOrder(order.orderId).subscribe({
          next: () => this.loadOrders(),
          error: (err) => console.error('Lỗi khi hủy đơn hàng:', err)
        });
      }
    });
  }

  deleteOrder(order: Order): void {
    if (!order.orderId) {
      console.error('Thiếu orderId!');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Xác nhận xóa',
        message: `Bạn có chắc muốn xóa đơn hàng "${order.orderId}"?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.deleteOrder(order.orderId).subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (err) => {
            console.error('Xóa đơn hàng thất bại:', err);
          }
        });
      }
    });
  }

  onStatusChange(order: Order, newStatus: string): void {
    if (order.status === newStatus) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: <ConfirmDialogData>{
          title: 'Xác nhận cập nhật',
          message: `Bạn có chắc muốn cập nhật trạng thái đơn hàng thành "${this.getStatusLabel(newStatus)}"?`,
          confirmText: 'Cập nhật',
          cancelText: 'Hủy'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.orderService.updateOrderStatus(order.orderId, newStatus).subscribe({
            next: () => {
              order.status = newStatus;
            },
            error: (err) => console.error('Cập nhật trạng thái thất bại:', err)
          });
        }
      });
  }
}
