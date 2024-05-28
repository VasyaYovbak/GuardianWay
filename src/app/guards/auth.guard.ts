import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {JwtService} from "../http/jwt";

export const AuthorizeGuard: CanActivateFn = () => {
  const jwtService = inject(JwtService);
  const router = inject(Router)
  const isJWTExist = jwtService.isJWTExist();

  if (!isJWTExist) {
    router.navigate(['/login'])
    return false;
  }

  return true;
}

