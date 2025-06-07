import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../models/product.model';

const CART_KEY = 'cartItems';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  private cartItemsSubject = new BehaviorSubject<Product[]>(this.cartItems);

  cartItems$ = this.cartItemsSubject.asObservable();

    constructor() {
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
  }

  addToCart(product: Product): void {
    this.cartItems.push(product);
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartToLocalStorage();
  }

  getCartItems(): Product[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
    this.saveCartToLocalStorage();
  }

  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter(p => p.id !== productId);
    this.cartItemsSubject.next(this.cartItems);
    this.saveCartToLocalStorage();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, p) => sum + p.price, 0);
  }
}
