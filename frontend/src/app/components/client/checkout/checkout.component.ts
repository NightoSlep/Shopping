import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/client/cart/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItemModel } from '../../../models/cart.model';
import { OrderService } from '../../../services/client/order/order.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/client/user/user.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  cartItems: CartItemModel[] = [];
  totalPrice: number = 0;
  selectedPaymentMethod: string = 'momo';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  checkout() {
    const user = this.userService.getCurrentUser();
    if (!user || !user.id) {
      alert('Bạn cần đăng nhập trước khi thanh toán.');
      return;
    }
    console.log("Cart Items", this.cartItems, "Payment Method", this.selectedPaymentMethod);
    this.orderService.checkout(this.cartItems, this.selectedPaymentMethod).subscribe({
      next: () => {
        alert('Đặt hàng thành công!');
        this.cartService.clearCart();
        this.router.navigate(['/order']);
      },
      error: err => {
        console.error('Đặt hàng thất bại:', err);
        alert('Có lỗi xảy ra khi đặt hàng.');
      }
    });
  }
}
