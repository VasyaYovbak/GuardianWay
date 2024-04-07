import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChildrenOutletContexts, RouterOutlet} from '@angular/router';

import {TopBarComponent} from "./top-bar/top-bar.component";
import {InitialPageComponent} from "./initial-page/initial-page.component";
import {slideInAnimation} from "./animations";
import {NavigationMenuComponent} from "./navigation-menu";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent, InitialPageComponent, NavigationMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent {

  constructor(private contexts: ChildrenOutletContexts) {
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
