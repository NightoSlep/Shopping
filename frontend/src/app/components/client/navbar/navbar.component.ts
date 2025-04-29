import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select'; 
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/client/user.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,
            MatToolbarModule,
            MatIconModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatMenuModule,
            MatSelectModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string = '';
  hideSearchBar: boolean = false;
  hideCart: boolean = false;  

  categories: Category[] = [
    { id: 'all', name: 'Tất cả' },
    { id: 'electronics', name: 'Điện tử' },
    { id: 'fashion', name: 'Thời trang' },
    { id: 'books', name: 'Sách' }
  ];

  selectedCategory: string = 'all';

  constructor(private router: Router, public authService: AuthService, private userService: UserService) {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.hideSearchBar = currentUrl.includes('/login') || currentUrl.includes('/register')|| currentUrl.includes('/profile') ;
      this.hideCart = currentUrl.includes('/login') || currentUrl.includes('/register');
    });
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.username = user.username;
      } else {
        const storedUsername = localStorage.getItem('username');
        this.username = storedUsername ? storedUsername : '';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToOrders(){

  }

  navigateToProfile(){
    this.router.navigate(['profile']);
  }

  navigateToSettings(){

  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  navigateToAdmin(){
    this.router.navigate(['/admin/dashboard']);
  }

  logout(){
    this.authService.logout();
    this.username = '';
    this.router.navigate(['/']);
  }
}
