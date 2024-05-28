import {FormControl} from "@angular/forms";

export interface DetectionSettings {
  showPotholes: boolean,
  showTrafficLights: boolean
}

export interface DetectionSettingsForm {
  showPotholes: FormControl<boolean>
  showTrafficLights: FormControl<boolean>
}
