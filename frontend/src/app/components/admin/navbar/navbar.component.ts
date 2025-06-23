import { Component } from '@angular/core';
import { AuthService } from '../../../services/shared/auth/auth.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/client/user/user.service';


@Component({
  selector: 'app-admin-navbar',
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string = '';

  constructor(private router: Router, private userService: UserService) {}
  
  logout(){
    this.userService.logout();
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
