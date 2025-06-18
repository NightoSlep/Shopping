export interface Product {
  id: string;
  productName: string;
  categoryId: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

export type NewProduct = Omit<Product, 'id'>;
