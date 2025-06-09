import { Product } from "./product.model";

export interface CartItemModel {
  product: Pick<Product, 'id' | 'productName' | 'image' | 'price'>;
  quantity: number;
}
