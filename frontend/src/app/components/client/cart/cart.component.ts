import { Component } from '@angular/core';
import { CartService } from '../../../services/client/cart/cart.service';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,
          MatButtonModule,
          MatCardModule,
          MatIconModule
    ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
