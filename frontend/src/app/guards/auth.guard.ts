import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/shared/storage/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(StorageService);

  const userRole = storage.getRole();

  if ( userRole !== 'admin') {
    alert('Bạn không có quyền truy cập trang này!');
    router.navigate(['/login']);
    return false;
  }

  return true; 
};
