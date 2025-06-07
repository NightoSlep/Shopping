import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/shared/auth/auth.service';
import { LoginResponse } from '../models/user.model';
import { StorageService } from '../services/shared/storage/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  const accessToken = storageService.getToken();
  const refreshToken = storageService.getRefreshToken();

  const excludedUrls = ['/auth/login', '/auth/refresh', '/oauth-callback'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded || !refreshToken) {
    return next(req);
  }

  if (!accessToken) {
    return from(authService.refreshToken()).pipe(
      switchMap((res: LoginResponse) => {
        storageService.setToken(res.access_token);
        if (res.refresh_token) {
          storageService.setRefreshToken(res.refresh_token);
        }

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${res.access_token}`
          }
        });

        return next(authReq);
      }),
      catchError((error) => {
        console.error('Token refresh error:', error);
        return throwError(() => error);
      })
    );
  }
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return next(authReq);
};
