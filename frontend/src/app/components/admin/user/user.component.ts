import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../../services/admin/user/user.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { User, Register, ManageUser } from '../../../models/user.model';
import { UserFormComponent } from './user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin-user',
    imports: [CommonModule,
               MatTableModule,
               MatFormFieldModule,
               MatInputModule,
               MatButtonModule,
               MatIconModule,
               FormsModule,
               MatToolbarModule,
               MatPaginatorModule,
               MatDialogModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  searchText: string = '';
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['stt', 'accountName', 'email', 'phone', 'role', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res;
      this.dataSource = new MatTableDataSource<User>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data: User, filter: string) => {
        return data.accountName.toLowerCase().includes(filter.trim().toLowerCase());
      };
    });
  }

  onSearch() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Register) => {
      if (result) {
        this.userService.createUser(result).subscribe(() => this.loadUsers());
      }
    });
  }

  editUser(user: ManageUser) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((updatedUser: ManageUser) => {
      if (updatedUser && user.id) {
        this.userService.updateUser(user.id, updatedUser).subscribe(() => this.loadUsers());
      }
    });
  }

  deleteUser(id: string, accountName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Xác nhận xóa',
        message: `Xác nhận xoá người dùng "${accountName}"?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(id).subscribe(() => this.loadUsers());
      }
    });
  }

  toggleActive(user: User) {
    const newStatus = !user.isActive;
    const action = newStatus ? 'mở khóa' : 'khóa';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Xác nhận',
        message: `Bạn có chắc chắn muốn ${action} tài khoản "${user.accountName}"?`,
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.updateStatusUser(user.id, { isActive: newStatus }).subscribe(() => this.loadUsers());
      }
    });
  }
}
