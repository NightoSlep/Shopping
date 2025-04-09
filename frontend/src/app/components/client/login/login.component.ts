import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/auth.service';
import { Login, LoginResponse } from '../../../models/user.model';

@Component({
    selector: 'app-login',
    imports: [CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule,
        MatToolbarModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword: boolean = true; 
  user: SocialUser | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar, 
    private socialAuthService: SocialAuthService) {}

  onLogin() {
    const loginData: Login = { username: this.username, password: this.password };
    this.authService.login(loginData).subscribe(
      (response: LoginResponse) => {
        localStorage.setItem('token', response.access_token);
        this.snackBar.open('Đăng nhập thành công!', 'OK', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error => {
        this.snackBar.open('Sai tên đăng nhập hoặc mật khẩu!', 'OK', { duration: 3000 });
      }
    );
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.user = user;
      this.authService.socialLogin(user.idToken, user.name);
      this.snackBar.open(`Đăng nhập thành công: ${user.name}`, 'OK', { duration: 3000 });
      this.router.navigate(['/']);
    }).catch(error => {
      this.snackBar.open('Đăng nhập Google thất bại!', 'OK', { duration: 3000 });
    });
  }

  loginWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
      this.user = user;
      this.authService.socialLogin(user.idToken, user.name);
      this.snackBar.open(`Đăng nhập thành công: ${user.name}`, 'OK', { duration: 3000 });
      this.router.navigate(['/']);
    }).catch(error => {
      this.snackBar.open('Đăng nhập Facebook thất bại!', 'OK', { duration: 3000 });
    });
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
