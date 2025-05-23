import { Component, ViewChild } from '@angular/core';
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
export class ProductComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';

  displayedColumns: string[] = [
    'stt',
    'productName',
    'categoryId',
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res;
      this.filteredProducts = res;
    });
  }

  onSearch() {
    const term = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.productName.toLowerCase().includes(term)
    );
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Xác nhận xóa',
        message: `Xác nhận xoá sản phẩm "${product.productName}"?`,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  editProduct(_product: Product) {
    // Mở dialog hoặc điều hướng đến form edit
  }

addProduct() {
  const dialogRef = this.dialog.open(ProductFormComponent, {
    width: '500px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const newProduct: NewProduct = {
        productName: result.name,
        price: result.price,
        description: result.description,
        quantity: result.quantity,
        categoryId: 0, 
        image: '' 
      };

      this.productService.createProduct(newProduct).subscribe(() => {
        this.loadProducts();
      });
    }
  });
}

}
