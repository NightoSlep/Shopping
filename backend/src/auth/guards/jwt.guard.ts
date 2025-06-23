import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IUser } from 'src/user/entities/user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const cookies = request.cookies as Record<string, string>;
    const token: string | undefined = cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const decodedUser = this.jwtService.verify<IUser>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request.user = decodedUser;
      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
