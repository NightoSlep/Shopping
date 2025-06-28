import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {
  @Input() category?: Category;
  @Output() saved = new EventEmitter<Category>();

  private _categoryName: string = '';
  isEditMode: boolean = false;

  get categoryName(): string {
    return this._categoryName;
  }

  set categoryName(value: string) {
    this._categoryName = this.capitalizeFirstLetter(value);
  }

  constructor(public dialogRef: MatDialogRef<CategoryFormComponent>,
              @Inject(MAT_DIALOG_DATA)  
              public data: {
                  title?: string;
                  message?: string;
                  confirmText?: string;
                  cancelText?: string;
                  category?: Category;
                }) {
    const input = data?.category || this.category;
    if (input) {
      this.categoryName = input.category_name;
      this.isEditMode = true;
    }
  }

  onSave(): void {
     if (this.categoryName.trim()) {
      const result: Category = {
        id: this.data.category?.id,
        category_name: this.categoryName
      };
      this.saved.emit(result);
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private capitalizeFirstLetter(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
