import {Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {component: HomePageComponent, title: 'Home', path: 'home'}
];
