import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword: boolean = true; 

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onLogin() {

    this.authService.login({ username: this.username, password: this.password }).subscribe(
      response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('username', this.username); 
        this.snackBar.open('Đăng nhập thành công!', 'OK', { duration: 3000 });
        this.router.navigate(['/']); // Chuyển hướng sau khi đăng nhập
      },
      error => {
        this.snackBar.open('Sai tên đăng nhập hoặc mật khẩu!', 'OK', { duration: 3000 });
      }
    );
  }

  loginWithGoogle() {
    alert('Chức năng đăng nhập bằng Google chưa được triển khai!');
  }

  loginWithFacebook() {
    alert('Chức năng đăng nhập bằng Facebook chưa được triển khai!');
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
}
}
