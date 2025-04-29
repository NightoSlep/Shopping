import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-home',
    imports: [MatCardModule,
            CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    categories = [
        { name: 'Laptop', image: 'https://res.cloudinary.com/dprb29hfv/image/upload/v1745503681/FL2C-A-BB-00_qiu6cs.jpg' },
        { name: 'Điện thoại', image: 'https://res.cloudinary.com/dprb29hfv/image/upload/laptops/buyguide-laptops-lightweight_njgm9q.png' },
        { name: 'Phụ kiện', image: 'https://res.cloudinary.com/dprb29hfv/image/upload/laptops/buyguide-laptops-lightweight_njgm9q.png' }
      ];
    
      featuredProducts = [
        { name: 'MacBook Pro M1', image: 'https://res.cloudinary.com/dprb29hfv/image/upload/laptops/buyguide-laptops-lightweight_njgm9q.png', price: 30000000 },
        { name: 'iPhone 14 Pro', image: 'https://res.cloudinary.com/dprb29hfv/image/upload/laptops/buyguide-laptops-lightweight_njgm9q.png', price: 25000000 },
        { name: 'Tai nghe AirPods Pro', image: 'https://res.cloudinary.com/dprb29hfv/image/upload/laptops/buyguide-laptops-lightweight_njgm9q.png', price: 5000000 }
      ];
    
      addToCart(product: any) {
        console.log('Thêm vào giỏ hàng:', product);
        // TODO: gọi service để thêm vào cart
      }
}
