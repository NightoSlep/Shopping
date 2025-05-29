export interface Product {
  id: number;
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
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}

  
  