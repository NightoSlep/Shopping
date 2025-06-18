import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../../services/admin/category/category.service';
import { Category } from '../../../../models/category.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit{
  productData = {
    productName: '',
    categoryId: '',
    price: 0,
    description: '',
    image: '',
    quantity: 1
  };

  productId: string | null = null;
  isEdit = false;
  categoryList: Category[] = [];
  imageFile!: File;
  imageUrl: string = '';

  constructor(private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product }
  ) {
    this.isEdit = !!data.product;
    if (this.isEdit && data.product) {
      const { id, categoryId, ...rest } = data.product;
      this.productData = {
        productName: data.product.productName,
        price: data.product.price,
        quantity: data.product.quantity,
        description: data.product.description,
        image: data.product.image,
        categoryId: data.product.categoryId || ''
      };
      this.productId = id;
      this.imageUrl = rest.image;
    }
  }

  ngOnInit() {
    this.loadCategories();
  } 

  loadCategories(): void {
    this.categoryService.getAll().subscribe((data: Category[]) => {
      this.categoryList = data;
    }, error => {
      console.error('Lỗi tải danh mục:', error);
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;

      const selectedCategory = this.categoryList.find(c => c.id === this.productData.categoryId);
      let categoryName = selectedCategory?.name?.toLowerCase() || 'default';
      categoryName = categoryName.replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

      const formData = new FormData();
      formData.append('file', this.imageFile);
      formData.append('upload_preset', 'shop_preset');
      formData.append('folder', `shop/${categoryName}`);

      fetch('https://api.cloudinary.com/v1_1/dprb29hfv/image/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        const originalUrl = data.secure_url;
        const optimizedUrl = originalUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1000/');
        this.imageUrl = optimizedUrl;
      })
      .catch(err => console.error('Upload failed:', err));
    }
  }

  save() {
  //     console.log('🧪 Dữ liệu sắp gửi:', {
  //   ...this.productData,
  //   image: this.imageUrl
  // });
    if (this.productData.productName && this.productData.price > 0) {
      const productToSave = {
        ...this.productData,
        price: Number(this.productData.price),
        image: this.imageUrl
      };
      this.dialogRef.close(productToSave);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
