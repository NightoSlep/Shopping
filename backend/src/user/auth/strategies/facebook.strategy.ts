import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_REDIRECT_URL'),
      profileFields: ['id', 'displayName', 'emails'],
      scope: ['email', 'public_profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      if (!profile) {
        throw new UnauthorizedException('Facebook authentication failed');
      }

      const { id, displayName, emails } = profile;

      if (!emails || emails.length === 0) {
        throw new UnauthorizedException('Email is required for authentication');
      }

      const user = {
        providerId: id,
        provider: 'facebook',
        username: displayName?.trim() || `facebook_user_${Date.now()}`,
        email: emails[0].value?.trim(),
        accessToken,
      };

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
