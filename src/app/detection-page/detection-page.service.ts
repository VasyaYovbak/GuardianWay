import {inject, Injectable} from "@angular/core";
import {HandleDetectionsService, POTHOLE_CLASS_IDS,} from "../services";
import {BehaviorSubject, Subject} from "rxjs";
import {ImageDetectionDataModel, WebWorkerDetectionMessage, WebWorkerMessage, WebWorkerMessageType} from "./models";
import {NotificationModel} from "./notifications-list";

@Injectable({
  providedIn: "root"
})
export class DetectionPageService {
  private _handleDetectionsService = inject(HandleDetectionsService);
  private _worker: Worker | null = null;

  public isWorkerReadySubject = new BehaviorSubject<boolean>(false);
  public detectionResponseSubject = new Subject<ImageDetectionDataModel>()

  notificationsSubject: Subject<NotificationModel> = this._handleDetectionsService.notificationsSubject;


  initWebWorker() {
    if (this._worker == null) {
      this._worker = new Worker(new URL('./detection.worker', import.meta.url));

      this._worker.onmessage = ({data}: { data: WebWorkerMessage }) => {
        if (data.type == WebWorkerMessageType.InitialMessage) {
          console.log('createCameraStream');
          this.isWorkerReadySubject.next(true);
        }

        if (data.type == WebWorkerMessageType.DetectionMessage) {
          this.handleWorkerDetectionMessage(data);
        }
      };
    }

  }

  handleWorkerDetectionMessage(message: WebWorkerDetectionMessage) {
    this.detectionResponseSubject.next(message.data);
    this.isWorkerReadySubject.next(true);

    this._handleDetectionsService.addDetectionsToStorage('pothole',
      message.data.predictions.filter(value => POTHOLE_CLASS_IDS.includes(value.class)));
    // this._handleDetectionsService.addDetectionsToStorage('traffic',
    //   message.data.predictions.filter(value => TRAFFIC_LIGHT_CLASS_IDS.includes(value.class)));
  }

  predictOnImage(image: ImageBitmap) {
    this.isWorkerReadySubject.next(false);
    this._worker?.postMessage(image)
  }

  disposeModels() {
    this._worker?.terminate()
    this._worker = null;
  }


}
