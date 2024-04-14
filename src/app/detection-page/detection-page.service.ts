import {inject, Injectable} from "@angular/core";
import {HandleDetectionsService, PotholeDetectionModelService, TrafficLightDetectionModelService} from "../services";
import {Subject} from "rxjs";
import {NotificationModel} from "./notifications-list";

@Injectable({
  providedIn: "root"
})
export class DetectionPageService {
  private _handleDetectionsService = inject(HandleDetectionsService)
  // private _potholeDetectionModelService = inject(PotholeDetectionModelService)
  private _trafficLightDetectionModelService = inject(TrafficLightDetectionModelService)

  async initModels(): Promise<Subject<NotificationModel>> {
    return new Promise((resolve) => {
      // this._potholeDetectionModelService.loadModel();
      this._trafficLightDetectionModelService.loadModel();

      this._handleDetectionsService.createStorageForClass('pothole');
      this._handleDetectionsService.setFrameRateTarget('pothole', 30);

      this._handleDetectionsService.createStorageForClass('traffic');
      this._handleDetectionsService.setFrameRateTarget('traffic', 30);

      resolve(this._handleDetectionsService.notificationsSubject)
    })
  }

  async predictOnImage(franeBitmap: ImageBitmap) {
    // const pothole_predictions = await this._potholeDetectionModelService.predict(franeBitmap) ?? [];
    // this._handleDetectionsService.addDetectionsToStorage('pothole', pothole_predictions);

    const traffic_detection = await this._trafficLightDetectionModelService.predict(franeBitmap) ?? [];
    this._handleDetectionsService.addDetectionsToStorage('traffic', traffic_detection);

    return traffic_detection
  }

  disposeModels() {
    // this._potholeDetectionModelService.disposeModel();
    this._trafficLightDetectionModelService.disposeModel();
  }
}
