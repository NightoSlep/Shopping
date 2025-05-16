export interface Product {
  id: string;
  productName: string;
  categoryId: number;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

export interface NewProduct {
    productName: string;
    categoryId: number;
    description: string;
    image: string;
    quantity: number;
    price: number;
  }
  
  