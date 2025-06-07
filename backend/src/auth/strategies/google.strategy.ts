/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_REDIRECT_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        '⚠️ Google OAuth Config Error: Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URL in environment variables.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      if (!profile) {
        throw new UnauthorizedException('Google authentication failed');
      }

      const { id, displayName, emails } = profile;

      if (!emails || emails.length === 0) {
        throw new UnauthorizedException('Email is required for authentication');
      }

      const user = {
        providerId: id,
        provider: 'google',
        username: displayName || `google_user_${Date.now()}`,
        email: emails[0].value,
        accessToken,
      };

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
