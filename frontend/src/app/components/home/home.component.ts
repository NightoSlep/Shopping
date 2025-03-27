import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatMenuModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

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
