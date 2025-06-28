import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NewProduct, Product } from '../../../models/product.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../services/admin/product/product.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductFormComponent } from './product-form/product-form.component';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/admin/category/category.service';

@Component({
  selector: 'app-admin-product',
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
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, AfterViewInit{
  products: Product[] = [];
  searchText: string = '';
  categories: Category[] = [];
  displayedColumns: string[] = [
    'stt',
    'productName',
    'categoryName',
    'description',
    'image',
    'quantity',
    'price',
    'actions'
  ];

  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res;
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res;
      this.dataSource = new MatTableDataSource<Product>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data: Product, filter: string) => {
        return data.productName.toLowerCase().includes(filter.trim().toLowerCase());
      };
    });
  }

  onSearch() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(id: string, productName: string) {
    if (!id) {
      console.error('ID is missing!');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Xác nhận xóa',
        message: `Xác nhận xoá sản phẩm "${productName}"?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe((updatedProduct: Product) => {
      if (updatedProduct && product.id) {
        this.productService.updateProduct(product.id, updatedProduct).subscribe(() => {
          this.loadProducts();
        }, err => {
          console.error('Update failed:', err);
        });
      }
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: NewProduct) => {
      if (result) {
        this.productService.createProduct(result).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.category_name : 'Không rõ';
  }
}
