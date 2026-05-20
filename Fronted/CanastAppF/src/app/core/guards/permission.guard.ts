import {
  inject,
} from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import {
  PermissionService,
} from 'src/app/data/services/permission.service';

export const permissionGuard:
CanActivateFn = () => {

  const permissionService =
    inject(PermissionService);

  const router =
    inject(Router);

  const autorizado =
    permissionService
      .tieneRol([
        'administrativo',
      ]);

  if (!autorizado) {

    router.navigate([
      '/login',
    ]);

    return false;
  }

  return true;
};