import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { User } from '../../../models/user.model';
import { Component } from '@angular/core';
import { UserService } from '../../../services/client/user.service';

@Component({
  selector: 'app-profile',
  imports: [ FormsModule,
              ReactiveFormsModule,
              MatInputModule,
              MatCardModule,
              MatSnackBarModule,
              MatButtonModule,
              ToastrModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userForm!: FormGroup;
  user!: User;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.userForm = this.fb.group({
          username: [user.username, [Validators.required]],
          email: [user.email, [Validators.required, Validators.email]],
          phone: [user.phone, [Validators.required]],
          address: [user.address, [Validators.required]],
        });
      },
      error: () => {
        this.toastr.error('Không thể tải thông tin người dùng.', 'Lỗi');
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.value };

      this.userService.updateMyProfile(updatedUser).subscribe({
        next: () => {
          this.snackBar.open('Thông tin đã được cập nhật!', 'Đóng', {
            duration: 3000,
            panelClass: ['mat-snack-bar-success'],
          });
      
          this.toastr.success('Cập nhật thành công!', 'Hồ sơ');
          this.isEditMode = false;
          this.user = updatedUser;
        },
        error: () => {
          this.toastr.error('Có lỗi khi cập nhật thông tin.', 'Lỗi');
        }
      });
      
    } else {
      this.toastr.error('Vui lòng nhập đầy đủ thông tin hợp lệ.', 'Lỗi');
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.userForm.patchValue(this.user);
    }
  }
}
