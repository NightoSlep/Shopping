import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/shared/storage/storage.service';
import { UserService } from '../../../services/client/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css'
})
export class OauthCallbackComponent implements OnInit{
  constructor(private router: Router, private storageService: StorageService, 
          private userService: UserService,  private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.userService.getMyProfile().subscribe({
        next: (userData) => {
          this.userService.setCurrentUser(userData);
          localStorage.setItem('username', userData.username);
          this.storageService.setRole(userData.role);

          this.snackBar.open('Đăng nhập thành công!', 'OK', { duration: 3000 });
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error: () => {
          this.snackBar.open('Không thể lấy thông tin người dùng!', 'OK', { duration: 3000 });
          this.router.navigate(['/login']);
        }
      });
    }, 500);
  }
}
