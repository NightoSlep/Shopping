import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { EMPTY, from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const token = storageService.getToken();
  const refreshToken = storageService.getRefreshToken();
  const router = inject(Router);

  const isExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  };

  if (token) {
    if (!isExpired(token)) {
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(clonedReq);
    }

    if (refreshToken && !isExpired(refreshToken)) {
      return from(authService.refreshToken(refreshToken)).pipe(
        switchMap((res: any) => {
          storageService.setToken(res.access_token);
          if (res.refresh_token) {
            storageService.setRefreshToken(res.refresh_token);
          }

          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${res.access_token}` }
          });

          return next(clonedReq);
        })
      );
    }

    storageService.clear();
    router.navigate(['/']);
    return EMPTY;
  }
  
  return next(req);
};