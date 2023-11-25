import {Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {InitialPageComponent} from "./initial-page/initial-page.component";

export const routes: Routes = [
  {
    component: InitialPageComponent, title: 'GuardianWay', path: '', data: {animation: 'InitialPage'}
  },
  {
    component: HomePageComponent, title: 'Home', path: 'home', data: {animation: 'HomePage'}
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
];
