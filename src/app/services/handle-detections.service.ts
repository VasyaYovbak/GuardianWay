import {inject, Injectable} from "@angular/core";
import {GeolocationService} from "./geolocation.service";
import {DetectedObjectInformation} from "../models";
import {Subject} from "rxjs";
import {NotificationModel, NotificationTypes} from "../detection-page/notifications-list";

interface FullDetectedObjectInformation {
  detections: DetectedObjectInformation[]
  coords: GeolocationCoordinates | null,
  timestamp: EpochTimeStamp | null;
}

@Injectable({
  providedIn: 'root',
})
export class HandleDetectionsService {
  private _GeolocationService = inject(GeolocationService)

  notificationsSubject: Subject<NotificationModel> = new Subject()

  private _detectionStorage: Map<string, FullDetectedObjectInformation[]> = new Map()
  private _frameRateTarget: Map<string, number> = new Map()

  createStorageForClass(classNameOrId: string) {
    this._detectionStorage = this._detectionStorage.set(classNameOrId, [])
  }

  setFrameRateTarget(classNameOrId: string, frameRateTarget: number) {
    this._frameRateTarget.set(classNameOrId, frameRateTarget);
  }

  async addDetectionsToStorage(classNameOrId: string, detections: DetectedObjectInformation[]) {
    if (!this._detectionStorage.get(classNameOrId)) {
      this.createStorageForClass(classNameOrId);
      this.setFrameRateTarget(classNameOrId, 8);
    }

    const isFirstOrLastFrame = this._detectionStorage.get(classNameOrId)!.length === 0 ||
      this._detectionStorage.get(classNameOrId)!.length === this._frameRateTarget.get(classNameOrId)! - 1;


    const geoPosition = isFirstOrLastFrame ?
      await this._GeolocationService.getCurrentLocation() : {
        coords: null,
        timestamp: null
      }

    this._detectionStorage.get(classNameOrId)!.push({
      detections: detections,
      timestamp: geoPosition.timestamp,
      coords: geoPosition.coords
    })

    if (this._detectionStorage.get(classNameOrId)?.length === this._frameRateTarget.get(classNameOrId)) {
      this.handleDetectionUnit(classNameOrId)
    }
  }

  private handleDetectionUnit(classNameOrId: string) {
    const detections = this._detectionStorage.get(classNameOrId)!
    this._detectionStorage.set(classNameOrId, []);

    if (classNameOrId == 'pothole') {
      const potholeCounts = detections.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.detections.length
      }, 0);

      if (potholeCounts > 0) {

        const options: any = {
          weekday: 'short', // abbreviated day name (e.g., "Mon")
          month: '2-digit', // two-digit month (e.g., "08")
          day: '2-digit',   // two-digit day of the month (e.g., "12")
          year: '2-digit',  // two-digit year (e.g., "23")
          hour: '2-digit',  // two-digit hour (e.g., "22")
          minute: '2-digit', // two-digit minute (e.g., "22"),
          second: '2-digit',
          hour12: false     // use 24-hour time format
        };

        const formattedDate = new Date(detections[0].timestamp!).toLocaleString('en-US', options);

        this.notificationsSubject.next({
          type: NotificationTypes.Pothole,
          date: formattedDate
        })
      }

      console.log(potholeCounts / this._frameRateTarget.get(classNameOrId)!)
      console.log(detections[0].coords)
    }
  }


}
