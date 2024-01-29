import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule, RouterOutlet} from "@angular/router";
import {SettingsPageComponent} from "./settings-page.component";
import {settingsPageRoutes} from "./settings-page.routes";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterOutlet,
    RouterModule.forChild(settingsPageRoutes),
    MatIconModule,
    MatButtonModule
  ],

})
export class SettingsPageModule {
}
