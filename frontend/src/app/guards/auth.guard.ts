import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return auth.isUserAuthorized().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        notification.notAuthorizedMessage();
        return false;
      }
    })
  );
};
