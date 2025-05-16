import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [ CommonModule,
            FormsModule,
            MatDialogModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {
  @Input() category?: Category;
  @Output() saved = new EventEmitter<Category>();

  categoryName: string = '';
  isEditMode: boolean = false;

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
      this.categoryName = input.name;
      this.isEditMode = true;
    }
  }

  onSave(): void {
     if (this.categoryName.trim()) {
      const result: Category = {
        id: this.data.category?.id,
        name: this.categoryName
      };
      this.saved.emit(result);
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
