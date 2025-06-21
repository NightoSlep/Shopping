import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItemModel } from '../../../models/cart.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OpenOrderDetail, Order } from '../../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  checkout(cartItems: CartItemModel[], paymentMethod: string): Observable<any> {
    const orderDetails = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const orderPayload = {
      orderDetails,
      paymentMethod
    };
    return this.http.post(this.apiUrl, orderPayload, { withCredentials: true });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  getDetailOrderById(orderId: string): Observable<OpenOrderDetail[]> {
    return this.http.get<OpenOrderDetail[]>(`${this.apiUrl}/me/${orderId}`, { withCredentials: true });
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/cancel`, {}, { withCredentials: true });
  }
}
