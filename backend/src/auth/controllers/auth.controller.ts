/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/role.guard';
import { AuthService } from '../services/auth.service';
import { Roles } from '../role.decorator';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng ký tài khoản (Username, Email, Password, Phone, Address)
  @Post('register')
  async register(@Body() authDto: RegisterDto) {
    return this.authService.register(authDto);
  }

  // Đăng nhập bằng username hoặc email
  @Post('login')
  async login(@Body() authDto: LoginDto) {
    return this.authService.login(authDto);
  }

  // Đăng nhập với Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  // Google callback (sau khi đăng nhập thành công)
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req) {
    return this.authService.validateOAuthUser(req.user);
  }

  // Đăng nhập với Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return { message: 'Redirecting to Facebook login...' };
  }

  // Facebook callback (sau khi đăng nhập thành công)
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req) {
    return this.authService.validateOAuthUser(req.user);
  }

  // API yêu cầu JWT để lấy thông tin user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
    };
  }

  // Refresh Token
  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') token: string) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
