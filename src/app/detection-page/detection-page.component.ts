import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraVisualizationComponent} from "./camera-visualization/camera-visualization.component";
import {WebcamConnectionService} from "../services";

@Component({
  selector: 'app-detection-page',
  standalone: true,
  imports: [CommonModule, CameraVisualizationComponent],
  templateUrl: './detection-page.component.html',
  styleUrl: './detection-page.component.scss'
})
export class DetectionPageComponent implements AfterViewInit {
  private _webcamConnectionService =  inject(WebcamConnectionService)

  cameraStream :MediaStream | null = null;

  ngAfterViewInit() {
    this._webcamConnectionService.createVideoStream().subscribe(stream => {
      this.cameraStream = stream;
    })
  }


}
