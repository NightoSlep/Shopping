import { Component } from '@angular/core';
import { AuthService } from '../../../services/shared/auth/auth.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../../services/shared/storage/storage.service';


@Component({
  selector: 'app-admin-navbar',
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.username = localStorage.getItem('username') ?? '';
  }
  
  logout(){
    this.authService.logout();
    this.username = '';
    this.router.navigate(['/']);
  }

  goToDashboard() {
    this.router.navigate(['admin/dashboard']);
  }

  goToClient(): void {
  this.router.navigate(['/']);
}
  
}
