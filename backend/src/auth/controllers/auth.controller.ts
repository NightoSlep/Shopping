/* eslint-disable @typescript-eslint/require-await */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true })) authDto: RegisterDto,
  ) {
    return this.authService.register(authDto);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true })) authDto: LoginDto,
  ) {
    return this.authService.login(authDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req) {
    return this.authService.validateOAuthUser(req.user);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return { message: 'Redirecting to Facebook login...' };
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req) {
    return this.authService.validateOAuthUser(req.user);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refresh_token', new ValidationPipe({ transform: true }))
    token: string,
  ) {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new BadRequestException(
        'Refresh token không được để trống hoặc không hợp lệ.',
      );
    }
    return this.authService.refreshToken(token);
  }
}
