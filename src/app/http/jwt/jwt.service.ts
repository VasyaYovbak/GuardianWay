import {inject, Injectable} from '@angular/core';
import {CookieService} from "../../services";
import {ACCESS_TOKEN, JWTModel, REFRESH_TOKEN} from "./models";
import {HttpClient} from "@angular/common/http";
import {BE_HTTP_API_URL} from "../../global.variables";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private _cookieService = inject(CookieService);
  private _http = inject(HttpClient)
  private _router = inject(Router)
  private _matSnackBar = inject(MatSnackBar)

  setJWT(jwt: JWTModel) {
    this._cookieService.set(ACCESS_TOKEN, jwt[ACCESS_TOKEN])
    this._cookieService.set(REFRESH_TOKEN, jwt[REFRESH_TOKEN])
  }

  clearJWT() {
    this._cookieService.remove(ACCESS_TOKEN)
    this._cookieService.remove(REFRESH_TOKEN)
  }

  isJWTExist() {
    return this._cookieService.get(REFRESH_TOKEN) != null;
  }

  refreshJWT() {
    return this._http.post<{
      [ACCESS_TOKEN]: string
    }>(BE_HTTP_API_URL + '/refresh', {}).pipe(catchError((error) => {
      if (error.status == '401') {
        this._matSnackBar.open('Your session has timed out, please log in again', 'Okay');
        this.clearJWT();
        this._router.navigate(['/login'])
      }

      return throwError(() => error);
    }))
  }
}
