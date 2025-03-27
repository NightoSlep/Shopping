import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/client/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,
            MatToolbarModule,
            MatIconModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string | null = null;
  hideSearchAndCart: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.hideSearchAndCart = currentUrl.includes('/login') || currentUrl.includes('/register');
    });
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.username = user;
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToOrders(){

  }

  navigateToProfile(){

  }

  navigateToSettings(){

  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  logout(){
    this.authService.logout();
    this.username = null;
  }
}
