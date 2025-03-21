import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// Import Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router:Router) {}

  onRegister() {
    console.log("register");
    this.authService.register({ username: this.username, password: this.password }).subscribe(
      response => {
        this.snackBar.open('Đăng ký thành công!', 'OK', { duration: 3000 });
      },
      error => {
        this.snackBar.open('Đăng ký thất bại!', 'OK', { duration: 3000 });
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
