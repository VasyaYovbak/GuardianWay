import {Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {InitialPageComponent} from "./initial-page/initial-page.component";
import {InformationPageComponent} from "./information-page";

export const routes: Routes = [
  {
    component: InitialPageComponent, title: 'GuardianWay', path: '', data: {animation: 'InitialPage'}
  },
  {
    component: HomePageComponent, title: 'Home', path: 'home', data: {animation: 'HomePage'}
  },
  {
    title: 'Detection',
    path: 'detection',
    data: {animation: 'DetectionPage'},
    loadChildren: () =>
      import('./detection-page').then(
        (lib) => lib.DETECTION_PAGE_ROUTES,
      ),
  },
  {
    component: InformationPageComponent, title: 'Information', path: 'info', data: {animation: 'InformationPage'}
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
];
