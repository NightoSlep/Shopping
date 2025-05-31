import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NewProduct, Product } from '../../../../models/product.model';

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
export class ProductFormComponent {
  productData = {
    productName: '',
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
    @Inject(MAT_DIALOG_DATA) public data: { newProduct?: NewProduct }
  ) {
    this.isEdit = !!data.newProduct;
    if (this.isEdit && data.newProduct) {
      this.productData = {
        productName: data.newProduct.productName || '',
        categoryId: data.newProduct.categoryId,
        price: data.newProduct.price || 0,
        description: data.newProduct.description || '',
        quantity: data.newProduct.quantity || 0,
        image: data.newProduct.image || ''
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
        this.imageUrl = data.secure_url;
      })
      .catch(err => console.error('Upload failed:', err));
    }
  }

save() {
  if (this.productData.productName && this.productData.price > 0) {
    const productToSave = {
      ...this.productData,
      image: this.imageUrl
    };
    this.dialogRef.close(productToSave);
  }
}

  cancel() {
    this.dialogRef.close();
  }
}
