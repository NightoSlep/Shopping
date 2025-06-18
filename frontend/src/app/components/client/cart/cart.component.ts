import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/client/cart/cart.service';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartItemModel } from '../../../models/cart.model';
import { Router } from '@angular/router';

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
export class CartComponent implements OnInit{
  cartItems: CartItemModel[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
