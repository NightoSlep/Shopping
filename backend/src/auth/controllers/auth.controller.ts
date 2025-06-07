import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Request, Response } from 'express';
import { IOAuthUser } from 'src/user/entities/oauth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true })) authDto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.register(authDto);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true })) authDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(authDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('Google redirect req.user:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'No user found' });
    }
    const tokens = await this.authService.validateOAuthUser(
      req.user as IOAuthUser,
    );
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return res.redirect(`https://localhost:4200/oauth-callback`);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.validateOAuthUser(
      req.user as IOAuthUser,
    );
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.redirect('https://localhost:4200/oauth-callback');
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const token = req.cookies?.refresh_token;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new BadRequestException(
        'Refresh token không được để trống hoặc không hợp lệ.',
      );
    }
    return this.authService.refreshToken(token);
  }
}
