export interface Product {
  id: string;
  productName: string;
  categoryId: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

export interface NewProduct {
  productName: string;
  categoryId: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}
