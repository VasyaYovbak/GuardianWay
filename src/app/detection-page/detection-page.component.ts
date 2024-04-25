import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraVisualizationComponent} from "./camera-visualization/camera-visualization.component";
import {WebcamConnectionService,} from "../services";
import {NotificationsListComponent} from "./notifications-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


import {DetectionPageService} from "./detection-page.service";
import {DetectionHubService} from "../http/detection-hub/detection-hub.service";

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

  private _webcamConnectionService = inject(WebcamConnectionService)
  public _detectionPageService = inject(DetectionPageService)
  private _detectionHubService = inject(DetectionHubService)

  private availableCameras: MediaStreamConstraints[] = [];


  private _isWorkerReady = false;

  cameraTrack: MediaStreamVideoTrack | null = null;

  ngOnInit() {
    this._detectionPageService.initWebWorker();
    this._detectionHubService.connectToHub();
    this._detectionPageService.notificationsSubject.subscribe((item) => {
      this.notificationList.addNotification(item);
    })
  }

  async ngAfterViewInit() {
    await this.initCameraDevices()

    this.createCameraStream();

    this._detectionPageService.isWorkerReadySubject.subscribe((state) => {
      this._isWorkerReady = state;
    })

    this._detectionPageService.detectionResponseSubject.subscribe((data) => {
      this.cameraVisualization.drawRectanglesOnImage(data.image, data.predictions)
    })


    // this._detectionPageService.initModels().then((notificationsSubject) => {
    //   notificationsSubject.subscribe(notification => this.notificationList.addNotification(notification));
    //   this.createCameraStream();
    // })
  }

  ngOnDestroy(): void {
    this.cameraTrack?.stop();
    this._detectionPageService.disposeModels();
    this._detectionHubService.disconnectFromHub();
  }

  private createCameraStream() {
    if (!this.availableCameras.length) {
      alert("Не знайдемо камери на вашому девайсі")
      return
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
    this.cameraTrack?.stop();
    this.availableCameras.push(this.availableCameras.shift()!);
    this.createCameraStream();
  }


  private async initCameraDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.availableCameras = devices.filter(device => device.kind === "videoinput").map(device => ({
      video: {
        deviceId: device.deviceId,
        frameRate: 8
      }
    }))
  }

  private sendMessage(image: ImageBitmap) {
    if (this._isWorkerReady) {
      this._detectionPageService.predictOnImage(image)
    }
  }
}


