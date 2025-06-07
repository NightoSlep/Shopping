import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/shared/auth/auth.service';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

// Import Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { Register } from '../../../models/user.model';

@Component({
    selector: 'app-register',
    imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule
],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit{
  username = '';
  password = '';
  confirmPassword = '';
  email = '';
  phone = ''; 
  address = '';

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isSubmitting = false;

  @ViewChild('usernameField') usernameField!: NgModel;
  @ViewChild('emailField') emailField!: NgModel;
  @ViewChild('phoneField') phoneField!: NgModel;
  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(private authService: AuthService, 
              private snackBar: MatSnackBar, 
              private router:Router,   
              private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Clear server errors when user types something new
    this.clearServerError(this.usernameField);
    this.clearServerError(this.emailField);
    this.clearServerError(this.phoneField);
  }

  onRegister() {
    this.registerForm.form.markAllAsTouched();

    if (this.confirmPassword && this.password !== this.confirmPassword) {
      this.registerForm.controls['confirmPassword'].setErrors({ mismatch: true });
      return;
    }

    if (!this.username || !this.password || !this.email || !this.phone) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin bắt buộc!', 'OK', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const registerData: Register = {
      username: this.username,
      password: this.password,
      email: this.email,
      phone: this.phone,
      address: this.address,
      role: 'user'
    };

    this.authService.register(registerData).subscribe(
      (response) => {
        this.snackBar.open('Đăng ký thành công!', 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      (err) => {
        this.isSubmitting = false;
        const message = err?.error?.message?.toLowerCase() || '';

        if (message.includes('username')) { this.usernameField.control.setErrors({ server: true }); }
        if (message.includes('email')) { this.emailField.control.setErrors({ server: true }); }
        if (message.includes('phone')) { this.phoneField.control.setErrors({ server: true }); }
        if (!message.includes('username') && 
            !message.includes('email') && 
            !message.includes('phone')) {
          this.snackBar.open(message, 'OK', { duration: 3000 });
        }
        this.cdr.detectChanges(); 
      }
    );
  }

  markAllAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      const control = form.controls[field];
      control.markAsTouched({ onlySelf: true });
    });
  }

  clearServerError(field: NgModel) {
    field.valueChanges?.subscribe(() => {
      const errors = field.errors;
      if (errors && errors['server']) {
        delete errors['server'];
        field.control.setErrors(Object.keys(errors).length ? errors : null);
      }
    });
  }
  
  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }
  
  toggleHideConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  passwordsDoNotMatch(): boolean {
    return (
      this.registerForm?.controls['confirmPassword']?.touched &&
      this.confirmPassword !== this.password
    );
  }  
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
