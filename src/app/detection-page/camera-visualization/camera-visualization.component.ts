import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetectedObjectInformation} from "../../models";

@Component({
  selector: 'app-camera-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-visualization.component.html',
  styleUrl: './camera-visualization.component.scss'
})
export class CameraVisualizationComponent {
  private _canvas = document.createElement('canvas');

  protected videoStream: MediaStream = this._canvas.captureStream();

  public drawRectanglesOnImage(imageBitmap: ImageBitmap, detectedObjects: DetectedObjectInformation[]) {
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
}
