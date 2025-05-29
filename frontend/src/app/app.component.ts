import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/client/user.service';
import { LoginResponse } from './models/user.model';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(
    private storage: StorageService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    const refreshToken = this.storage.getRefreshToken();
    if (refreshToken) {
      this.authService.refreshToken(refreshToken).subscribe({
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
}
