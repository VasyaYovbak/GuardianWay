import {inject, Injectable} from "@angular/core";
import {GeolocationService} from "./geolocation.service";
import {DetectedObjectInformation, DetectionUnitInfo} from "../models";
import {Subject} from "rxjs";
import {NotificationModel, NotificationTypes} from "../detection-page/notifications-list";
import {DetectionStorageService} from "./detection-storage.service";

interface FullDetectedObjectInformation {
  detections: DetectedObjectInformation[]
  coords: GeolocationCoordinates,
  timestamp: EpochTimeStamp;
}


export enum DetectionTypes {
  Pothole = 'pothole',
  Traffic = 'traffic'
}

type DetectionStorage = {
  [key in DetectionTypes]?: FullDetectedObjectInformation[]
}

@Injectable({
  providedIn: 'root',
})
export class HandleDetectionsService {
  private _GeolocationService = inject(GeolocationService)
  private _DetectionStorageService = inject(DetectionStorageService)

  notificationsSubject: Subject<NotificationModel> = new Subject();

  private _detectionStorage: DetectionStorage = {
    [DetectionTypes.Pothole]: []
  }

  async addDetectionsToStorage(classNameOrId: "pothole", detections: DetectedObjectInformation[]) {
    const storageRef = this._detectionStorage[classNameOrId]!;

    const geoPosition = await this._GeolocationService.getCurrentLocation()

    storageRef.push({
      detections: detections,
      timestamp: Date.now(),
      coords: geoPosition.coords
    })

    const timeDifference = storageRef[storageRef.length - 1].timestamp - storageRef[0].timestamp;

    if (timeDifference > 1000) {
      this.handleDetectionUnit(classNameOrId, storageRef)
    }
  }

  private handleDetectionUnit(classNameOrId: "pothole", storageRef: FullDetectedObjectInformation[]) {
    if (!storageRef.length) {
      return
    }

    if (classNameOrId == 'pothole') {
      const potholeCounts = storageRef.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.detections.length
      }, 0);
      const potholeDensity = potholeCounts / storageRef.length;

      const lastElement = storageRef.slice(-1)[0]
      const firstElement = storageRef[0]

      if (firstElement == null) {
        return;
      }

      const averageCors: GeolocationCoordinates = {
        ...firstElement.coords,
        latitude: (lastElement.coords.latitude + firstElement.coords.latitude) / 2,
        longitude: (lastElement.coords.longitude + firstElement.coords.longitude) / 2,
      }

      const unit: DetectionUnitInfo = {
        density: potholeDensity,
        object_id: 1,
        location: averageCors,
        timestamp: new Date(lastElement.timestamp).toISOString().replace('Z', '')
      }

      this._DetectionStorageService.saveData(unit);
      if (unit.density > 1) {
        this.notificationsSubject.next({
          type: NotificationTypes.Pothole,
          date: unit.timestamp
        })
      }
    }

    this._detectionStorage[classNameOrId] = [];
  }


}
