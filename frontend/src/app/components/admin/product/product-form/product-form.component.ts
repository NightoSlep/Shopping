import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../../services/admin/category/category.service';
import { Category } from '../../../../models/category.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule,
            FormsModule,
            MatDialogModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatSelectModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  productData = {
    name: '',
    categoryId: 0,
    price: 0,
    description: '',
    image: '',
    quantity: 1
  };

  categoryList: Category[] = [];
  isEdit: boolean;
  imageFile!: File;
  imageUrl: string = '';

  constructor(private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product }
  ) {
    this.isEdit = !!data.product;
    if (this.isEdit && data.product) {
      this.productData = {
        name: data.product.productName || '',
        categoryId: data.product.categoryId,
        price: data.product.price || 0,
        description: data.product.description || '',
        quantity: data.product.quantity || 0,
        image: data.product.image || ''
      };
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

      const formData = new FormData();
      formData.append('file', this.imageFile);
      formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');

      fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        this.imageUrl = data.secure_url;
        console.log('Image URL:', this.imageUrl);
      })
      .catch(err => console.error('Upload failed:', err));
    }
  }

save() {
  if (this.productData.name && this.productData.price > 0) {
    const productToSave = {
      ...this.productData,
      imageUrl: this.imageUrl
    };
    this.dialogRef.close(productToSave);
  }
}

  cancel() {
    this.dialogRef.close();
  }
}
