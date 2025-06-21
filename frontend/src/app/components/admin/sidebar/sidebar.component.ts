import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [ MatIconModule, MatListModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currentRoute: string = '';
  
  constructor(private router: Router) {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: 'products', label: 'Sản phẩm', icon: 'inventory_2' },
    { path: 'categories', label: 'Thể loại', icon: 'category' },
    { path: 'orders', label: 'Đơn hàng', icon: 'receipt_long' },
    // { path: 'customers', label: 'Khách hàng', icon: 'group' },
    { path: 'banners', label: 'Banner', icon: 'image' }
  ];
  
  goTo(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }
}
