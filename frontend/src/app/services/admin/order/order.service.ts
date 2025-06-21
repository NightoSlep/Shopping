import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OpenOrderDetail, Order } from '../../../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrderDetailById(id: string): Observable<OpenOrderDetail[]> {
    return this.http.get<OpenOrderDetail[]>(`${this.apiUrl}/${id}/detail`);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
