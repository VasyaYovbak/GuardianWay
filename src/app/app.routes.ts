import {Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {InitialPageComponent} from "./initial-page/initial-page.component";
import {InformationPageComponent} from "./information-page";
import {AuthRoutes} from "./auth";
import {AuthorizeGuard} from "./guards";

export const routes: Routes = [
  {
    component: InitialPageComponent,
    title: 'GuardianWay',
    path: '',
    data: {animation: 'InitialPage'},
    canActivate: [AuthorizeGuard]
  },
  {
    component: HomePageComponent,
    title: 'Home',
    path: 'home',
    data: {animation: 'HomePage'},
    canActivate: [AuthorizeGuard]
  },
  {
    title: 'Detection',
    path: 'detection',
    data: {animation: 'DetectionPage'},
    canActivate: [AuthorizeGuard],
    loadChildren: () =>
      import('./detection-page').then(
        (lib) => lib.DETECTION_PAGE_ROUTES,
      ),
  },
  {
    component: InformationPageComponent,
    title: 'Information',
    path: 'info',
    data: {animation: 'InformationPage'},
    canActivate: [AuthorizeGuard]
  },
  {
    title: 'Settings', path: 'settings', data: {animation: 'SettingsPage'},
    loadChildren: () =>
      import('./settings-page').then(
        (lib) => lib.SettingsPageModule,
      ),
    canActivate: [AuthorizeGuard]
  },
  ...AuthRoutes,
  {path: '**', redirectTo: '', pathMatch: 'full'},
];
