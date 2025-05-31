import { Component, ViewChild } from '@angular/core';
import { Category } from '../../../models/category.model';
import { HttpClient } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CategoryService } from '../../../services/admin/category/category.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryFormComponent } from './category-form/category-form.component';

@Component({
  selector: 'app-category',
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, MatToolbarModule, MatPaginatorModule, MatDialogModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  searchText: string = '';

  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => {
       this.dataSource.data = data;
    });
  }

  onSearch(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: {
        title: 'Thêm thể loại mới',
        confirmText: 'Lưu',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.create(result).subscribe({
          next: () => this.loadCategories(),
          error: err => console.error('Lỗi khi thêm thể loại:', err)
        });
      }
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: {
        title: 'Cập nhật thể loại',
        confirmText: 'Cập nhật',
        cancelText: 'Hủy',
        category: category
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Sending data to API:', result);
        this.categoryService.updateCategory(result).subscribe({
          next: () => this.loadCategories(),
          error: err => console.error('Lỗi khi cập nhật thể loại:', err)
        });
      }
    });
  }

  deleteCategory(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: <ConfirmDialogData>{
          title: 'Xác nhận xóa',
          message: 'Bạn có chắc chắn muốn xóa mục này?',
          confirmText: 'Xóa',
          cancelText: 'Hủy'
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.delete(id).subscribe({
          next: () => this.loadCategories(),
          error: err => console.error('Lỗi khi xóa thể loại:', err)
        });
      }
    });
  }
}
