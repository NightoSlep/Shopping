import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/shared/auth/auth.service';
import { Login, LoginResponse } from '../../../models/user.model';
import { StorageService } from '../../../services/shared/storage/storage.service';
import { UserService } from '../../../services/client/user/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-login',
    imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatSnackBarModule, MatToolbarModule, MatProgressSpinnerModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  username = '';
  password = '';
  hidePassword: boolean = true; 
  isLoggingIn = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar, 
    private storage: StorageService,
    private userService: UserService,
    private route: ActivatedRoute) {}
    
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];

      if (token && refreshToken) {
        this.storage.setToken(token);
        this.storage.setRefreshToken(refreshToken);

        this.userService.getMyProfile().subscribe({
          next: (userData) => {
            this.userService.setCurrentUser(userData);

            localStorage.setItem('username', userData.username);
            this.storage.setRole(userData.role);

            this.snackBar.open('Đăng nhập thành công!', 'OK', { duration: 3000 });
            this.router.navigate(['/']);
          },
          error: () => {
            this.snackBar.open('Không thể lấy thông tin người dùng!', 'OK', { duration: 3000 });
          }
        });
      }
    });
  }

  onLogin() {
    this.isLoggingIn = true; 
  
    const loginData: Login = { username: this.username, password: this.password };
    this.authService.login(loginData).subscribe({
      next: (response: LoginResponse) => {
        this.storage.setToken(response.access_token);
        this.storage.setRefreshToken(response.refresh_token);
  
        this.userService.getMyProfile().subscribe({
          next: (userData) => {
            this.userService.setCurrentUser(userData);
  
            localStorage.setItem('username', userData.username);
            this.storage.setRole(userData.role);
  
            this.snackBar.open('Đăng nhập thành công!', 'OK', { duration: 3000 });
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.snackBar.open('Không thể lấy thông tin người dùng!', 'OK', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.snackBar.open('Sai tên đăng nhập hoặc mật khẩu!', 'OK', { duration: 3000 });
      }
    });
  }
  
  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToHome(){
    this.router.navigate(['/']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
