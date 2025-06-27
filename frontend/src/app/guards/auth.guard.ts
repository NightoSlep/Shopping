import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/client/user/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const currentUser = userService.getCurrentUser();

  if (!currentUser || currentUser.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang này!');
    router.navigate(['/']);
    return false;
  }
  return true; 
};
