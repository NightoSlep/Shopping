import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
