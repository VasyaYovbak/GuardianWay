import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraVisualizationComponent} from "./camera-visualization/camera-visualization.component";
import {
  WebcamConnectionService,
} from "../services";
import {NotificationsListComponent} from "./notifications-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DetectionPageService} from "./detection-page.service";

@Component({
  selector: 'app-detection-page',
  standalone: true,
  imports: [CommonModule, CameraVisualizationComponent, NotificationsListComponent, MatIconModule, MatButtonModule],
  templateUrl: './detection-page.component.html',
  styleUrl: './detection-page.component.scss'
})
export class DetectionPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild(NotificationsListComponent) notificationList!: NotificationsListComponent;
  @ViewChild(CameraVisualizationComponent) cameraVisualization!: CameraVisualizationComponent;

  private _webcamConnectionService = inject(WebcamConnectionService)
  private _detectionPageService = inject(DetectionPageService)


  private availableCameras: MediaStreamConstraints[] = [];


  cameraTrack: MediaStreamVideoTrack | null = null;

  async ngAfterViewInit() {
    await this.initCameraDevices();

    this._detectionPageService.initModels().then((notificationsSubject) => {
      notificationsSubject.subscribe(notification => this.notificationList.addNotification(notification));
      this.createCameraStream();
    })
  }

  ngOnDestroy(): void {
    this.cameraTrack?.stop();
    this._detectionPageService.disposeModels();
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
          const franeBitmap = await createImageBitmap(frame);
          const predictions = await this._detectionPageService.predictOnImage(franeBitmap);

          this.cameraVisualization.drawRectanglesOnImage(franeBitmap, predictions);
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
        frameRate: 30
      }
    }))
  }
}
