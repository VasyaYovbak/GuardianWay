import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraVisualizationComponent} from "./camera-visualization/camera-visualization.component";
import {WebcamConnectionService,} from "../services";
import {NotificationsListComponent, NotificationTypes} from "./notifications-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


import {DetectionPageService} from "./detection-page.service";
import {DetectionHubService} from "../http/detection-hub/detection-hub.service";
import {DetectionStorageService} from "../services/detection-storage.service";
import {HttpClient} from "@angular/common/http";
import {BE_HTTP_API_URL} from "../global.variables";

@Component({
  selector: 'app-detection-page',
  standalone: true,
  imports: [CommonModule, CameraVisualizationComponent, NotificationsListComponent, MatIconModule, MatButtonModule],
  templateUrl: './detection-page.component.html',
  styleUrl: './detection-page.component.scss'
})
export class DetectionPageComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(NotificationsListComponent) notificationList!: NotificationsListComponent;
  @ViewChild(CameraVisualizationComponent) cameraVisualization!: CameraVisualizationComponent;

  private _http = inject(HttpClient)

  private _webcamConnectionService = inject(WebcamConnectionService)
  public _detectionPageService = inject(DetectionPageService)
  private _detectionHubService = inject(DetectionHubService)
  private _detectionStorageService = inject(DetectionStorageService)

  private availableCameras: MediaStreamConstraints[] = [];


  private _isWorkerReady = false;

  cameraTrack: MediaStreamVideoTrack | null = null;

  async ngOnInit() {
    this._detectionPageService.initWebWorker();
    // this._detectionHubService.connectToHub();
    this._detectionPageService.notificationsSubject.subscribe((item) => {
      this.notificationList.addNotification(item);
    })
    this._detectionStorageService.batchSaved.subscribe(() => {
      this.notificationList.addNotification({
        type: NotificationTypes.BatchSave,
        date: new Date(Date.now()).toISOString().replace('Z', '')
      });
    })

    await this.initCameraDevices()
  }

  async ngAfterViewInit() {


    this._detectionPageService.isWorkerReadySubject.subscribe((state) => {
      this._isWorkerReady = state;
    })

    this._detectionPageService.detectionResponseSubject.subscribe((data) => {
      this.cameraVisualization.drawRectanglesOnImage(data.image, data.predictions)
    })
  }

  ngOnDestroy(): void {
    this.cameraTrack?.stop();
    this._detectionPageService.disposeModels();
    // this._detectionHubService.disconnectFromHub();
  }

  private createCameraStream() {
    if (!this.availableCameras.length) {
      return;
    }

    this._webcamConnectionService.createVideoStream(this.availableCameras[0]).subscribe({
      next: async stream => {
        this.cameraTrack = stream.getVideoTracks()[0];
        const trackProcessor = new MediaStreamTrackProcessor({track: this.cameraTrack});
        const trackGenerator = new MediaStreamTrackGenerator({kind: "video"});

        const transformer = this._webcamConnectionService.getVideoFrameTransform(async (frame) => {
          this.sendMessage(await createImageBitmap(frame))

          return frame.clone();
        })

        await trackProcessor.readable
          .pipeThrough(transformer).pipeTo(trackGenerator.writable)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  protected changeInputCamera() {
    if (this.cameraTrack?.readyState == 'live') {
      this.cameraTrack?.stop();
      this.availableCameras.push(this.availableCameras.shift()!);
      this.createCameraStream();
    }
  }


  private async initCameraDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.availableCameras = devices.filter(device => device.kind === "videoinput").map(device => ({
      video: {
        deviceId: device.deviceId,
        frameRate: 8
      }
    }))

    if (!this.availableCameras.length) {
      alert("Не знайдемо камери на вашому девайсі")
      return
    }
  }

  private sendMessage(image: ImageBitmap) {
    if (this._isWorkerReady) {
      this._detectionPageService.predictOnImage(image)
    }
  }

  onPlay() {
    this.createCameraStream();
  }

  onPause() {
    this.cameraTrack?.stop();
  }

  onSave() {
    this._detectionStorageService.getBatches().forEach((batch) => {
      this._http.post<{ batchId:string }>(BE_HTTP_API_URL + '/data_processing/process_data_batch', batch).subscribe((batchId) => {
        this._detectionStorageService.deleteBatch(batchId.batchId)
      })
    })
  }
}


