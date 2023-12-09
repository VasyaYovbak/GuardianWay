import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-camera-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-visualization.component.html',
  styleUrl: './camera-visualization.component.scss'
})
export class CameraVisualizationComponent {
  private _videoStream: MediaStream | null = null;

  @Input()
  set videoStream(stream: MediaStream) {
    this._videoStream = stream;
  }

  get videoStream(): MediaStream | null {
    return this._videoStream;
  }
}
