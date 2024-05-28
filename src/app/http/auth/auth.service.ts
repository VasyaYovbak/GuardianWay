import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDTOModel, LoginResponseModel, RegisterDTOModel} from "./models";
import {BE_HTTP_API_URL} from "../../global.variables";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient)

  register(data: RegisterDTOModel) {
    return this._http.post(`${BE_HTTP_API_URL}/register`, data)
  }

  login(data: LoginDTOModel) {
    return this._http.post<LoginResponseModel>(`${BE_HTTP_API_URL}/login`, data)
  }

}
