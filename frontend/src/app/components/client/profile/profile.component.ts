import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/client/user/user.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { first, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  passwordForm!: FormGroup;

  isEditMode = false;
  isChangingPassword = false;
  hidePassword = true;
  expandedPanel: string | null = 'profile';
  isLoading = true;
  passwordMismatch = false;

  private userSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.userService.currentUser$
      .pipe(first(user => !!user))
      .subscribe(user => {
        this.patchUserForm(user);
        this.isLoading = false;
      });
    this.userService.loadUserProfileIfNeeded();
  }

  get currentUser$() {
    return this.userService.currentUser$;
  }

  private initForms(): void {
    this.userForm = this.fb.group({
      accountName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  patchUserForm(user: any): void {
    if (user) {
      this.userForm.patchValue(user);
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.showError('Vui lòng nhập đầy đủ thông tin hợp lệ.');
      return;
    }

    const updatedUser = this.userForm.value;
    this.userService.updateMyProfile(updatedUser).subscribe({
      next: (res) => {
        this.userService.setCurrentUser(res);
        this.isEditMode = false;
        this.snackBar.open('Thông tin đã được cập nhật!', 'Đóng', {
          duration: 3000,
          panelClass: ['mat-snack-bar-success'],
        });
      },
      error: (err) => {
        console.error(err);
        this.showError('Có lỗi khi cập nhật thông tin.');
      }
    });
  }

  changePassword(): void {
    this.passwordMismatch = false;
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.showError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      this.passwordForm.get('confirmPassword')?.markAsTouched();
      this.showError('Mật khẩu mới không khớp.');
      return;
    }
    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Đổi mật khẩu thành công!', 'Đóng', {
          duration: 3000,
          panelClass: ['mat-snack-bar-success']
        });
        this.isChangingPassword = false;
        this.passwordForm.reset();
      },
      error: (e) => {
        console.log(e);
        this.showError('Không thể đổi mật khẩu. Kiểm tra mật khẩu cũ.');
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  closeChangingPassword(): void {
    this.isChangingPassword = false;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000,
      panelClass: ['mat-snack-bar-error']
    });
  }
}
