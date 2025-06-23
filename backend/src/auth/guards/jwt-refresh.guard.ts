import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as Record<string, string>;
    const token: string | undefined = cookies?.refresh_token;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Refresh token is missing or invalid');
    }

    try {
      const decoded: JwtPayload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
