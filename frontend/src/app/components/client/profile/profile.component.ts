import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { User } from '../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/client/user/user.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatCardModule, MatSnackBarModule, MatButtonModule, MatIconModule, ToastrModule, MatExpansionModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userForm!: FormGroup;
  user!: User;
  isEditMode: boolean = false;
  isLoading = true;
  hidePassword = true;
  isChangingPassword: boolean = false;
  
  passwordForm!: FormGroup;

  expandedPanel: string | null = 'profile'; 

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {    
    this.initForm();
    this.loadUserProfile();
    this.initPasswordForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }
  
  loadUserProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (userData: User) => {
        this.user = userData;
        this.userForm.patchValue(userData);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Không thể tải thông tin người dùng.', 'Lỗi');
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.toastr.error('Vui lòng nhập đầy đủ thông tin hợp lệ.', 'Lỗi');
      return;
    }

    const updatedUser: User = { ...this.user, ...this.userForm.value };

    this.userService.updateMyProfile(updatedUser).subscribe({
      next: () => {
        this.user = updatedUser;
        this.isEditMode = false;
        this.snackBar.open('Thông tin đã được cập nhật!', 'Đóng', {
          duration: 3000,
          panelClass: ['mat-snack-bar-success'],
        });
        this.toastr.success('Cập nhật thành công!', 'Hồ sơ');
      },
      error: () => {
        this.toastr.error('Có lỗi khi cập nhật thông tin.', 'Lỗi');
      },
    });
  }

  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }
  
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin.', 'Lỗi');
      return;
    }
  
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
  
    if (newPassword !== confirmPassword) {
      this.toastr.error('Mật khẩu mới không khớp.', 'Lỗi');
      return;
    }
  
    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.toastr.success('Đổi mật khẩu thành công!');
        this.isChangingPassword = false;
        this.passwordForm.reset();
      },
      error: () => {
        this.toastr.error('Không thể đổi mật khẩu. Kiểm tra mật khẩu cũ.', 'Lỗi');
      }
    });
  }
  
  onForgotPassword(): void {
    this.toastr.info('Chức năng quên mật khẩu đang được phát triển.');
  }

  closeChangingPassword(): void {
    this.isChangingPassword = false;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      this.userForm.patchValue(this.user);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
