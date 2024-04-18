import {AfterViewInit, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraVisualizationComponent} from "./camera-visualization/camera-visualization.component";
import {MLService, WebcamConnectionService} from "../services";
import {NotificationsListComponent} from "./notifications-list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-detection-page',
  standalone: true,
  imports: [CommonModule, CameraVisualizationComponent, NotificationsListComponent, MatIconModule, MatButtonModule],
  templateUrl: './detection-page.component.html',
  styleUrl: './detection-page.component.scss'
})
export class DetectionPageComponent implements AfterViewInit, OnDestroy {
  private _webcamConnectionService = inject(WebcamConnectionService)
  private _MLService = inject(MLService)
  private _canvas = document.createElement('canvas');
  videoStream: MediaStream | null = this._canvas.captureStream();

  private availableCameras: MediaStreamConstraints[] = [];


  cameraTrack: MediaStreamVideoTrack | null = null;

  async ngAfterViewInit() {
    await this.initCameraDevices();

    this._MLService.loadModel('assets/models/best-pothole-640-tfjs-uint8/model.json').then(() => {
      this.createCameraStream();
    })
  }

  ngOnDestroy(): void {
    this.cameraTrack?.stop();
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
          console.log(frame.codedWidth)
          const predictions = await this._MLService.predict(franeBitmap);
          this.drawRectanglesOnImage(franeBitmap, predictions ?? [])

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

  drawRectanglesOnImage(imageBitmap: ImageBitmap, bboxes: number[][]) {
    const ctx = this._canvas.getContext('2d')!;

    this._canvas.width = imageBitmap.width;
    this._canvas.height = imageBitmap.height;

    ctx.drawImage(imageBitmap, 0, 0);

    bboxes.forEach(bbox => {
      const [x, y, w, h] = bbox;
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.rect(x - w / 2, y - h / 2, w, h);
      ctx.stroke();
    });
  }

  async initCameraDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.availableCameras = devices.filter(device => device.kind === "videoinput").map(device => ({
      video: {
        deviceId: device.deviceId,
        frameRate: 30
      }
    }))
  }

  changeInputCamera() {
    this.cameraTrack?.stop();
    this.availableCameras.push(this.availableCameras.shift()!);
    this.createCameraStream();
  }
}
