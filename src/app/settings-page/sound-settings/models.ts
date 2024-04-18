import {FormControl} from "@angular/forms";

export interface SoundSettings {
  playPotholesDetectionSound: boolean,
  playTrafficLightsDetectionSound: boolean
}

export interface SoundSettingsForm {
  playPotholesDetectionSound: FormControl<boolean>
  playTrafficLightsDetectionSound: FormControl<boolean>
}
