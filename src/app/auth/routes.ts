import {Route} from "@angular/router";
import {LoginComponent} from "./login";
import {RegisterComponent} from "./register";

export const AuthRoutes: Route[] = [
  {
    component: LoginComponent, title: 'Login', path: 'login', data: {animation: 'LoginPage'}
  },
  {
    component: RegisterComponent, title: 'Registration', path: 'register', data: {animation: 'RegistrationPage'}
  }
]
