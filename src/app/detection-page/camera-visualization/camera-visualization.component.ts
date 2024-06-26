import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetectedObjectInformationWithVisualInfo} from "../../models";

@Component({
  selector: 'app-camera-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-visualization.component.html',
  styleUrl: './camera-visualization.component.scss'
})
export class CameraVisualizationComponent implements AfterViewInit {
  @Output() play = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();

  @ViewChild('player',{static:true}) player !: ElementRef<HTMLVideoElement>;


  async ngAfterViewInit() {
    const ctx = this._canvas.getContext('2d')!;
    ctx.fillStyle = '#58A5C9';
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '16px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Press to start', this._canvas.width / 2, this._canvas.height / 2);

    setTimeout(()=>this.player.nativeElement.pause(),300)
  }

  private _canvas = document.createElement('canvas');

  protected videoStream: MediaStream = this._canvas.captureStream();

  public drawRectanglesOnImage(imageBitmap: ImageBitmap, detectedObjects: DetectedObjectInformationWithVisualInfo[]) {
    const ctx = this._canvas.getContext('2d')!;

    this._canvas.width = imageBitmap.width;
    this._canvas.height = imageBitmap.height;

    ctx.drawImage(imageBitmap, 0, 0);

    detectedObjects.forEach(detectedObject => {
      const {x, y, w, h} = detectedObject.bbox;
      ctx.beginPath();
      ctx.strokeStyle = detectedObject.color;
      ctx.lineWidth = 3;
      ctx.rect(x - w / 2, y - h / 2, w, h);
      ctx.stroke();
    });
  }
}
