import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './services/shared/storage/storage.service';
import { AuthService } from './services/shared/auth/auth.service';
import { UserService } from './services/client/user/user.service';
import { LoginResponse } from './models/user.model';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent{
  constructor(
    private storage: StorageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.refreshToken().subscribe({
      next: (response: LoginResponse) => {
        this.storage.setToken(response.access_token);
        if (response.refresh_token) {
          this.storage.setRefreshToken(response.refresh_token); 
        }
        this.userService.getMyProfile().subscribe(userData => {
          this.userService.setCurrentUser(userData);
          localStorage.setItem('username', userData.username);
        });
      },
      error: () => {
        this.authService.logout();
      }
    });
  }
}
