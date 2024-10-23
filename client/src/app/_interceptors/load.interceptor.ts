import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ComponentArgsService } from '../_services/component-args.service';
import { finalize } from 'rxjs';

export const loadInterceptor: HttpInterceptorFn = (req, next) => {
  const argsService = inject(ComponentArgsService);
  argsService.loading.set(true);
  return next(req).pipe(
    finalize(() => argsService.loading.set(false))
  );
};
