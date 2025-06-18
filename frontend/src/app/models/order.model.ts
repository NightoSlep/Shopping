export interface Order {
  orderId: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  orderDetail?: OrderItem[]; 
}

export interface OrderItem {
  orderDetailId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OpenOrderDetail {
  orderDetailId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  productImage: string;
  productPrice: number;
  createdAt: string;
}

