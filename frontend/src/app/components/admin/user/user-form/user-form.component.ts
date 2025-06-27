import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../services/admin/user/user.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit{
  userForm!: FormGroup;
  user?: User;
  allUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {}

  ngOnInit(): void {
    this.user = this.data.user;
    this.userForm = this.fb.group({
      username: [this.user ? null : '', this.user ? [] : [Validators.required]],
      accountName: [this.user?.accountName || '', this.user ? [Validators.required] : []],
      email: [this.user?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
      phone: [this.user?.phone || '', [Validators.pattern(/^[0-9]*$/)]],
      address: [this.user?.address || ''],
      password: ['', this.user ? [] : [Validators.required]],
      role: [this.user?.role || 'user', Validators.required],
    });

     if (!this.user) {
      this.userService.getAllUsers().subscribe((users) => {
        this.allUsers = users;
        this.userForm.get('username')?.valueChanges.subscribe((val) => {
          const exists = this.allUsers.some((u) => u.username === val);
          if (exists) {
            this.userForm.get('username')?.setErrors({ usernameExists: true });
          } else {
            const errors = this.userForm.get('username')?.errors;
            if (errors) {
              delete errors['usernameExists'];
              this.userForm.get('username')?.setErrors(Object.keys(errors).length ? errors : null);
            }
          }
          this.userForm.get('accountName')?.setValue(val, { emitEvent: false });
        });

        this.userForm.get('email')?.valueChanges.subscribe((val) => {
          const exists = this.allUsers.some((u) => u.email === val);
          if (exists) {
            this.userForm.get('email')?.setErrors({ emailExists: true });
          } else {
            const errors = this.userForm.get('email')?.errors;
            if (errors) {
              delete errors['emailExists'];
              this.userForm.get('email')?.setErrors(Object.keys(errors).length ? errors : null);
            }
          }
        });
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (!this.user) {
        const username = this.userForm.get('username')?.value;
        this.userForm.get('accountName')?.setValue(username);
        this.dialogRef.close(this.userForm.value);
      } else {
        const { password, username, ...updateData } = this.userForm.value;
        this.dialogRef.close(updateData);
      }
    }
  }
}
