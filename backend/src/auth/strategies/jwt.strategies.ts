import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
        if (typeof tokenExtractor === 'function') {
          return tokenExtractor(req);
        }
        return null;
      },
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
