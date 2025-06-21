import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { Order, OrderStatus } from '../entities/order.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { JwtAuthGuard, UserPayload } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { OpenOrderDetail } from '../dto/open-order-detail.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @AuthUser() user: UserPayload,
    @Body()
    body: {
      orderDetails: CreateOrderDetailDto[];
      paymentMethod: string;
    },
  ): Promise<Order> {
    return this.orderService.createOrder(body, user.id);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyOrders(@AuthUser() user: UserPayload): Promise<Order[]> {
    return this.orderService.getOrdersByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async getMyOrderDetails(
    @Param('id') orderId: string,
    @AuthUser() user: UserPayload,
  ): Promise<OpenOrderDetail[]> {
    return await this.orderService.getOrderDetailsSecure(orderId, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id/detail')
  async getOrderDetailsByAdmin(
    @Param('id') orderId: string,
  ): Promise<OpenOrderDetail[]> {
    return this.orderService.getOrderDetailsByAdmin(orderId);
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<Order> {
    return this.orderService.getOrderById(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatusByAdmin(orderId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancelMyOrder(@Param('id') orderId: string, @AuthUser() user: UserPayload) {
    return this.orderService.cancelOrderByUser(orderId, user.id);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderById(orderId, updateOrderDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    await this.orderService.deleteOrderById(orderId);
    return { message: 'Order deleted successfully' };
  }
}
