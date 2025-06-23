import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select'; 
import { AuthService } from '../../../services/shared/auth/auth.service';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/client/user/user.service';
import { CartService } from '../../../services/client/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatSelectModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  username: string = '';
  hideSearchBar: boolean = false;
  hideCart: boolean = false;
  cartItemCount = 0;
  isLoggedIn = false;
  isAdmin: boolean = false;

  constructor(private router: Router,
              private authService: AuthService, 
              public userService: UserService, 
              private cartService: CartService) {
    this.router.events.subscribe(() => this.updateViewVisibility());
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe((user: User | null) => {
      this.username = user?.username ?? '';
      this.isLoggedIn = !!user;
    });
  }

  private updateViewVisibility() {
    const url = this.router.url;
    const authPages = ['/login', '/register'];
    this.hideSearchBar = authPages.some(p => url.includes(p)) || url.includes('/profile');
    this.hideCart = authPages.some(p => url.includes(p));
  }

  get isProfilePage(): boolean {
    return this.router.url.includes('/profile');
  }

  logout(){
    this.userService.logout().subscribe({
      next: () => {
        this.username = '';
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Lỗi logout:', err);
      }
    });
  }

  navigateToCart() { 
    this.router.navigate(this.isLoggedIn ? ['/cart'] : ['/login']);
  }

  navigateToOrders() { 
    this.router.navigate(this.isLoggedIn ? ['/order'] : ['/login']);
  }

  navigateToLogin() { this.router.navigate(['/login']);}
  navigateToProfile(){ this.router.navigate(['profile']); }
  navigateToHome(){ this.router.navigate(['/']); }
  navigateToAdmin(){ this.router.navigate(['/admin/dashboard']); }
  navigateToSettings(){ }
}
