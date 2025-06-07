import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CartService } from '../../../services/client/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
 cartItems: Product[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotalPrice();
  }

  submitOrder() {
    // TODO: Gửi đơn hàng về backend (nếu có)
    alert('Đặt hàng thành công!');
    this.cartService.clearCart();
  }
}
