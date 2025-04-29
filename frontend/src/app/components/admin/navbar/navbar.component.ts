import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string = '';

  constructor(private router: Router, private authService: AuthService) {}
  logout(){
    this.authService.logout();
    this.username = '';
    this.router.navigate(['/']);
  }
}
