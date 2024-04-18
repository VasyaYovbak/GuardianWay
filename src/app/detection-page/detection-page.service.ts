import {inject, Injectable} from "@angular/core";
import {
  HandleDetectionsService,
  POTHOLE_CLASS_IDS,
  TRAFFIC_LIGHT_CLASS_IDS,
} from "../services";
import {BehaviorSubject, Subject} from "rxjs";
import {ImageDetectionDataModel, WebWorkerDetectionMessage, WebWorkerMessage, WebWorkerMessageType} from "./models";

@Injectable({
  providedIn: "root"
})
export class DetectionPageService {
  private _handleDetectionsService = inject(HandleDetectionsService);
  private _worker: Worker | null = null;

  public isWorkerReadySubject = new BehaviorSubject<boolean>(false);
  public detectionResponseSubject = new Subject<ImageDetectionDataModel>()

  constructor() {
    this.initStorage();
  }

  initWebWorker() {
    if (this._worker == null) {
      this._worker = new Worker(new URL('./detection.worker', import.meta.url));

      this._worker.onmessage = ({data}: { data: WebWorkerMessage }) => {
        if (data.type == WebWorkerMessageType.InitialMessage) {
          console.log('createCameraStream');
          this.isWorkerReadySubject.next(true);
        }

        if (data.type == WebWorkerMessageType.DetectionMessage) {
          console.log("detected");
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
    this._handleDetectionsService.addDetectionsToStorage('traffic',
      message.data.predictions.filter(value => TRAFFIC_LIGHT_CLASS_IDS.includes(value.class)));
  }

  predictOnImage(image: ImageBitmap) {
    this.isWorkerReadySubject.next(false);
    this._worker?.postMessage(image)
  }

  disposeModels() {
    this._worker?.terminate()
    this._worker = null;
  }

  private initStorage() {
    this._handleDetectionsService.createStorageForClass('pothole');
    this._handleDetectionsService.setFrameRateTarget('pothole', 30);

    this._handleDetectionsService.createStorageForClass('traffic');
    this._handleDetectionsService.setFrameRateTarget('traffic', 30);
  }
}
