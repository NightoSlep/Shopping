import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Category } from '../../../models/category.model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/admin/product/product.service';
import { CategoryService } from '../../../services/admin/category/category.service';
import { MatButtonModule } from '@angular/material/button';
import { BannerService } from '../../../services/admin/banner/banner.service';
import { Banner } from '../../../models/banner.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../services/client/cart/cart.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/client/user/user.service';

@Component({
    selector: 'app-home',
    imports: [MatCardModule,
            CommonModule, MatButtonModule, MatProgressSpinnerModule],
    animations: [
      trigger('fadeInUp', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
        ])
      ])
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  categories: Category[] = [];
  allProducts: Product[] = [];
  selectedCategoryId: string | null = null;
  featuredProducts: Product[] = [];
  banners: Banner[] = [];
  currentBannerIndex = 0;
  
  bannerInterval: any;
  isLoading = true;
  isLoggedIn = false;
  showLoginPrompt = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private bannerService: BannerService,  
    private cartService: CartService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.loadUserProfileIfNeeded();
    this.userService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    this.isLoading = true;
    Promise.all([
      this.loadCategories().catch(err => console.error(err)),
      this.loadProducts().catch(err => console.error(err)),
      this.loadBanners().catch(err => console.error(err))
    ]).finally(() => this.isLoading = false);
  }


  loadCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getAll().subscribe({
        next: (data) => {
          this.categories = data;
          resolve();
        },
        error: (err) => {
          console.error('Lỗi tải categories:', err);
          resolve();
        }
      });
    });
  }

  loadProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getAllProducts().subscribe({
        next: (data) => {
          this.allProducts = data;
          this.featuredProducts = data;
          resolve();
        },
        error: (err) => {
          console.error('Lỗi tải sản phẩm:', err);
          resolve();
        }
      });
    });
  }

  loadBanners(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bannerService.getBanners().subscribe({
        next: (data) => {
          this.banners = data;
          if (this.banners.length > 1) {
            this.startBannerRotation();
          }
          resolve();
        },
        error: (err) => {
          console.error('Lỗi tải banner:', err);
          resolve();
        }
      });
    });
  }

  startBannerRotation(): void {
    this.bannerInterval = setInterval(() => {
      this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.bannerInterval);
  }

  prevBanner(): void {
    this.currentBannerIndex =
      (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }

  nextBanner(): void {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  goToBanner(index: number): void {
    this.currentBannerIndex = index;
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    if (categoryId === null) {
      this.featuredProducts = this.allProducts;
    } else {
      this.featuredProducts = this.allProducts.filter(
        product => product.categoryId === categoryId
      );
    }
  }

  addToCart(product: Product) {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product);
  }
}
