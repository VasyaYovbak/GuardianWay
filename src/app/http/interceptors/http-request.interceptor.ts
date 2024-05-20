import {inject, Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';


import {finalize, Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {JwtService} from "../jwt";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private _jwtService = inject(JwtService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('refresh')) {
      req = req.clone({
        url: req.url,
        headers: new HttpHeaders({
          "Authorization": "Bearer " + this._jwtService.getAccessToken(),
          'ngsw-bypass': 'true'
        })
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/signin') &&
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      const isJWTExist = this._jwtService.isJWTExist();

      if (isJWTExist) {
        return this._jwtService.refreshJWT().pipe(
          finalize(() => {
            this.isRefreshing = false;
          }),
          switchMap(() => {
            return next.handle(request);
          })
        );
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
];
