import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { User } from '../../../models/user.model';
import { Component } from '@angular/core';
import { UserService } from '../../../services/client/user.service';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-profile',
  imports: [ FormsModule,
              ReactiveFormsModule,
              MatInputModule,
              MatCardModule,
              MatSnackBarModule,
              MatButtonModule,
              ToastrModule,
              CommonModule,
              MatExpansionModule
              ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userForm!: FormGroup;
  user!: User;
  isEditMode: boolean = false;
  isLoading = true;

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
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
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

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      this.userForm.patchValue(this.user);
    }
  }
}
