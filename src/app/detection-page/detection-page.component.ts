import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraVisualizationComponent} from "./camera-visualization/camera-visualization.component";
import {MLService, WebcamConnectionService, GeolocationService, HandleDetectionsService} from "../services";
import {NotificationsListComponent} from "./notifications-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DetectedObjectInformation} from "../models";

@Component({
  selector: 'app-detection-page',
  standalone: true,
  imports: [CommonModule, CameraVisualizationComponent, NotificationsListComponent, MatIconModule, MatButtonModule],
  templateUrl: './detection-page.component.html',
  styleUrl: './detection-page.component.scss'
})
export class DetectionPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild(NotificationsListComponent) notificationList!: NotificationsListComponent;

  private _webcamConnectionService = inject(WebcamConnectionService)
  private _MLService = inject(MLService)
  private _HandleDetectionsService = inject(HandleDetectionsService)


  private _canvas = document.createElement('canvas');
  videoStream: MediaStream | null = this._canvas.captureStream();

  private availableCameras: MediaStreamConstraints[] = [];


  cameraTrack: MediaStreamVideoTrack | null = null;

  async ngAfterViewInit() {
    await this.initCameraDevices();
    this._HandleDetectionsService.createStorageForClass('pothole');
    this._HandleDetectionsService.setFrameRateTarget('pothole', 30);

    this._HandleDetectionsService.notificationsSubject
      .subscribe(notification => this.notificationList.addNotification(notification))


    this._MLService.loadModel('assets/models/best-pothole-640-tfjs-uint8/model.json').then(() => {
      this.createCameraStream();
    })
  }

  ngOnDestroy(): void {
    this.cameraTrack?.stop();
    this._MLService.disposeModel();
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
          const franeBitmap = await createImageBitmap(frame)
          const predictions = await this._MLService.predict(franeBitmap) ?? [];
          this._HandleDetectionsService.addDetectionsToStorage('pothole', predictions);

          this.drawRectanglesOnImage(franeBitmap, predictions)
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

  private drawRectanglesOnImage(imageBitmap: ImageBitmap, detectedObjects: DetectedObjectInformation[]) {
    const ctx = this._canvas.getContext('2d')!;

    this._canvas.width = imageBitmap.width;
    this._canvas.height = imageBitmap.height;

    ctx.drawImage(imageBitmap, 0, 0);

    detectedObjects.forEach(detectedObject => {
      const {x, y, w, h} = detectedObject.bbox;
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.rect(x - w / 2, y - h / 2, w, h);
      ctx.stroke();
    });
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
