import {Injectable} from "@angular/core";
import {DetectionSettings} from "../settings-page";
import {SoundSettings} from "../settings-page/sound-settings/models";

const defaultCameraDetectionSettings: DetectionSettings = {
  showPotholes: true,
  showTrafficLights: true
}

const defaultSoundSettings: SoundSettings = {
  playPotholesDetectionSound: true,
  playTrafficLightsDetectionSound: true
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
  }

  updateCameraDetectionSettings(detectionSettings: DetectionSettings) {
    console.log(detectionSettings)

    localStorage.setItem('settingsCameraDetection', JSON.stringify(detectionSettings))
  }

  getCameraDetectionSettings(): DetectionSettings {
    const settings = localStorage.getItem('settingsCameraDetection');
    console.log(settings)

    if (settings) {
      return JSON.parse(settings)
    }

    return defaultCameraDetectionSettings
  }

  updateSoundSettings(detectionSettings: SoundSettings) {
    console.log(detectionSettings)

    localStorage.setItem('settingsSound', JSON.stringify(detectionSettings))
  }

  getSoundSettings(): SoundSettings {
    const settings = localStorage.getItem('settingsSound');
    console.log(settings)

    if (settings) {
      return JSON.parse(settings)
    }

    return defaultSoundSettings
  }
}
