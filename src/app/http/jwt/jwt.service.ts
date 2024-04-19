import {inject, Injectable} from '@angular/core';
import {CookieService} from "../../services";
import {ACCESS_TOKEN, JWTModel, REFRESH_TOKEN} from "./models";
import {HttpClient} from "@angular/common/http";
import {BE_HTTP_API_URL} from "../../global.variables";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private _cookieService = inject(CookieService);
  private _http = inject(HttpClient)

  setJWT(jwt: JWTModel) {
    this._cookieService.set(ACCESS_TOKEN, jwt[ACCESS_TOKEN])
    this._cookieService.set(REFRESH_TOKEN, jwt[REFRESH_TOKEN])
  }

  clearJWT() {
    this._cookieService.remove(ACCESS_TOKEN)
    this._cookieService.remove(REFRESH_TOKEN)
  }

  setAccessToken(access_token: string) {
    this._cookieService.set(ACCESS_TOKEN, access_token)
  }

  getRefreshToken() {
    return this._cookieService.get(REFRESH_TOKEN);
  }

  getAccessToken() {
    return this._cookieService.get(ACCESS_TOKEN);
  }

  getJWT(): JWTModel | null {
    const refresh_token = this.getRefreshToken();
    const access_token = this.getAccessToken();

    if (!refresh_token || !access_token) {
      return null;
    }

    return {
      access_token, refresh_token
    }
  }

  refreshJWT() {
    const refreshToken = this._cookieService.get(REFRESH_TOKEN);

    return this._http.post<{
      [ACCESS_TOKEN]: string
    }>(BE_HTTP_API_URL + '/refresh', {}, {headers: {Authorization: `Bearer ${refreshToken}`}})
  }
}
