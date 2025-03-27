import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes), 
              provideAnimationsAsync(), 
              provideHttpClient(),
              importProvidersFrom(SocialLoginModule), // Import module để sử dụng trong Standalone API
              {
                provide: 'SocialAuthServiceConfig',
                useValue: {
                  autoLogin: false,
                  providers: [
                    {
                      id: GoogleLoginProvider.PROVIDER_ID,
                      provider: new GoogleLoginProvider(environment.googleClientId),
                    },
                    {
                      id: FacebookLoginProvider.PROVIDER_ID,
                      provider: new FacebookLoginProvider(environment.facebookAppId),
                    },
                  ],
                } as SocialAuthServiceConfig,
              },
            ],
};
