import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Category } from '../../../models/category.model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/admin/product/product.service';
import { CategoryService } from '../../../services/admin/category/category.service';
import { MatButtonModule } from '@angular/material/button';
import { BannerService } from '../../../services/admin/banner/banner.service';
import { Banner } from '../../../models/banner.model';

@Component({
    selector: 'app-home',
    imports: [MatCardModule,
            CommonModule, MatButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  banners: Banner[] = [];

    constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private bannerService: BannerService
  ) {}

    ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadBanners();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Lỗi tải categories:', err)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.featuredProducts = data,
      error: (err) => console.error('Lỗi tải sản phẩm:', err)
    });
  }

  loadBanners(): void {
    this.bannerService.getBanners().subscribe({
      next: (data) => this.banners = data,
      error: (err) => console.error('Lỗi tải banner:', err)
    });
  }

  addToCart(product: Product) {
    console.log('Thêm vào giỏ hàng:', product);
    // TODO: gọi service để thêm vào cart
  }
}
