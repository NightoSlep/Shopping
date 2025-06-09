import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../models/product.model';
import { CartItemModel } from '../../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItemModel[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();


  addToCart(product: Product) {
    const currentCart = this.cartItemsSubject.getValue();
    console.log('Adding to cart:', product);

    const existingItem = currentCart.find(item => item.product.id === product.id);
    console.log('Existing item:', existingItem);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const item: CartItemModel = {
        product: {
          id: product.id,
          productName: product.productName,
          price: product.price,
          image: product.image
        },
        quantity: 1
      };
      currentCart.push(item);
    }

    this.cartItemsSubject.next([...currentCart]);
  }

  removeItem(id: string) {
    const updatedCart = this.cartItemsSubject.getValue().filter(item => item.product.id !== id);
    this.cartItemsSubject.next(updatedCart);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.getValue().reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getCartCount(): number {
    return this.cartItemsSubject.getValue().reduce((count, item) => count + item.quantity, 0);
  }
}
