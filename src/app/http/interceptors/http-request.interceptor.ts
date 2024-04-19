import {inject, Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';


import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {ACCESS_TOKEN, JwtService} from "../jwt";
import {Router} from "@angular/router";
import {BE_HTTP_API_URL} from "../../global.variables";
import {MatSnackBar} from "@angular/material/snack-bar";

const SKIP_URL_LIST = [BE_HTTP_API_URL + '/login', BE_HTTP_API_URL + '/register', BE_HTTP_API_URL + '/refresh']

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private _jwtService = inject(JwtService)
  private _router = inject(Router)
  private _matSnackBar = inject(MatSnackBar)


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url);
    console.log(!SKIP_URL_LIST.includes(req.url))
    if (!SKIP_URL_LIST.includes(req.url)) {
      req = this.setAccessToken(req);
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
      const refresh_token = this._jwtService.getRefreshToken();

      if (refresh_token != null) {
        return this._jwtService.refreshJWT().pipe(
          switchMap((jwt) => {
            this.isRefreshing = false;
            this._jwtService.setAccessToken(jwt[ACCESS_TOKEN]);

            request = this.setAccessToken(request);
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '401') {
              this._matSnackBar.open('Your session has timed out, please log in again', 'Okay');
              this._jwtService.clearJWT();
              this._router.navigate(['/login'])
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  private setAccessToken(req: HttpRequest<any>) {
    const jwt = this._jwtService.getJWT();

    if (jwt) {
      req = req.clone({
        url: req.url,
        setHeaders: {
          Authorization: `Bearer ${jwt[ACCESS_TOKEN]}`
        }
      });
    }

    return req
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
];
