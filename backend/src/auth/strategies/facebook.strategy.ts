import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile as FacebookBaseProfile } from 'passport-facebook';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface FacebookEmail {
  value: string;
}

interface FacebookProfile extends FacebookBaseProfile {
  id: string;
  displayName: string;
  emails: FacebookEmail[];
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID');
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_REDIRECT_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Facebook OAuth environment configuration');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'displayName', 'emails'],
      scope: ['email', 'public_profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: FacebookProfile,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const facebookProfile = profile;
      const { id, displayName, emails } = facebookProfile;
      if (!emails || emails.length === 0) {
        return done(new UnauthorizedException('Email is required'), false);
      }

      const user = {
        providerId: id,
        provider: 'facebook',
        username: displayName?.trim() || `facebook_user_${Date.now()}`,
        email: emails[0].value?.trim(),
        accessToken,
      };
      done(null, user);
    } catch (error: unknown) {
      return done(
        error instanceof Error ? error : new Error('Unknown error'),
        false,
      );
    }
  }
}
