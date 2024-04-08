import {inject, Injectable} from "@angular/core";
import {HandleDetectionsService, PotholeDetectionModelService} from "../services";
import {Subject} from "rxjs";
import {NotificationModel} from "./notifications-list";

@Injectable({
  providedIn: "root"
})
export class DetectionPageService {

  private _handleDetectionsService = inject(HandleDetectionsService)
  private _potholeDetectionModelService = inject(PotholeDetectionModelService)


  async initModels(): Promise<Subject<NotificationModel>> {
    return new Promise((resolve, reject) => {
      this._potholeDetectionModelService.loadModel();

      this._handleDetectionsService.createStorageForClass('pothole');
      this._handleDetectionsService.setFrameRateTarget('pothole', 30);

      resolve(this._handleDetectionsService.notificationsSubject)
    })
  }

  async predictOnImage(franeBitmap: ImageBitmap) {
    const pothole_predictions = await this._potholeDetectionModelService.predict(franeBitmap) ?? [];
    this._handleDetectionsService.addDetectionsToStorage('pothole', pothole_predictions);

    return pothole_predictions
  }

  disposeModels() {
    this._potholeDetectionModelService.disposeModel()
  }
}
