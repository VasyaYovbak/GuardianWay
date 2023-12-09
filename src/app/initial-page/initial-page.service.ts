import {Injectable} from '@angular/core';
import {PotholePosition} from "./models";

@Injectable({
  providedIn: 'root'
})
export class InitialPageService {

  originalHeight = 1728;
  originalWidth = 1507;

  constructor() {
  }

  getCurrentPotholePosition(pothole: PotholePosition): PotholePosition {
    const originalAspectRatio = this.originalWidth / this.originalHeight;
    const currentAspectRatio = window.innerWidth / window.innerHeight;

    if (originalAspectRatio > currentAspectRatio) {
      const koef = this.originalHeight / window.innerHeight;
      const widthDiff = this.originalWidth - window.innerWidth * koef;
      const newXPos = (pothole.x - widthDiff / 2) / ((this.originalWidth - widthDiff) / window.innerWidth);

      return {
        x: +newXPos.toFixed(0),
        y: +(pothole.y / koef).toFixed(0),
        height: +(pothole.height / koef).toFixed(0),
        width: +(pothole.width / koef).toFixed(0)
      }

    } else {
      const koef = this.originalWidth / window.innerWidth;
      const heightDiff = this.originalHeight - window.innerHeight * koef;

      const newYPos = (pothole.y - heightDiff / 2) / ((this.originalHeight - heightDiff) / window.innerHeight);

      return {
        x: +(pothole.x / koef).toFixed(0),
        y: +newYPos.toFixed(0),
        height: +(pothole.height / koef).toFixed(0),
        width: +(pothole.width / koef).toFixed(0)
      }
    }

  }
}
