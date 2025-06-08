import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
