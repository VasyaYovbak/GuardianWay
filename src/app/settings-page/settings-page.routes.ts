import {Routes} from "@angular/router";
import {SettingsPageComponent} from "./settings-page.component";
import {DetectionSettingsComponent} from "./detection-settings/detection-settings.component";
import {GeneralSettingsInfoComponent} from "./general-settings-info/general-settings-info.component";
import {SoundSettingsComponent} from "./sound-settings/sound-settings.component";

export const settingsPageRoutes: Routes = [
  {
    component: SettingsPageComponent, title: 'Settings', path: '',
    children: [
      {
        component: GeneralSettingsInfoComponent,
        path: '',
      },
      {
        component: DetectionSettingsComponent,
        path: 'detection',
      },
      {
        component: SoundSettingsComponent,
        path: 'sound',
      }
    ]
  },
];
