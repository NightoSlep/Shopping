import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request as ExpressRequest } from 'express';

interface RequestWithCookies extends ExpressRequest {
  cookies: {
    access_token?: string;
    [key: string]: any;
  };
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private configService: ConfigService) {
    const cookieExtractor: JwtFromRequestFunction = (
      req,
    ): string | null | undefined => {
      const request = req as RequestWithCookies;
      return request.cookies?.access_token || null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
      ]) as JwtFromRequestFunction,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
