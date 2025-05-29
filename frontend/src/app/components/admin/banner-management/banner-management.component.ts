import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Banner } from '../../../models/banner.model';
import { BannerService } from '../../../services/admin/banner/banner.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-banner-management',
  standalone: true,
  imports: [CommonModule,
          FormsModule,
          MatCardModule,
          MatFormFieldModule,
          MatInputModule,
          MatButtonModule,
          MatIconModule,
          MatProgressSpinnerModule
        ],
  templateUrl: './banner-management.component.html',
  styleUrls: ['./banner-management.component.css']
})
export class BannerManagementComponent {
  banners: Banner[] = [];
  selectedFile!: File;
  uploadedImageUrl: string = '';
  bannerName: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private bannerService: BannerService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.bannerService.getBanners().subscribe({
      next: (data) => this.banners = data,
      error: (err) => console.error('Lỗi khi tải banners:', err)
    });
  }

  triggerFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadToCloudinary(file);
    }
  }

  uploadToCloudinary(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'shop_preset');
    formData.append('folder', 'shop/banners');

    fetch('https://api.cloudinary.com/v1_1/dprb29hfv/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.uploadedImageUrl = data.secure_url;
      console.log('Upload thành công:', this.uploadedImageUrl);
    })
    .catch(err => {
      console.error('Lỗi khi upload:', err);
    });
  }

  saveBanner(): void {
    if (!this.uploadedImageUrl) return;

    const newBanner = {
      name: this.bannerName || 'Banner không tên',
      url: this.uploadedImageUrl
    };

    this.bannerService.addBanner(newBanner).subscribe({
      next: (res) => {
        this.loadBanners();
        this.uploadedImageUrl = '';
        this.bannerName = '';
        this.fileInput.nativeElement.value = '';
        console.log('Lưu banner thành công!');
      },
      error: (err) => console.error('Lỗi khi lưu banner:', err)
    });
  }

  deleteBanner(id: number): void {
    this.bannerService.deleteBanner(id).subscribe(() => {
      this.banners = this.banners.filter(b => b.id !== id);
    });
  }
}
