import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {GoogleMap, MapAdvancedMarker} from "@angular/google-maps";
import {GeolocationService} from "../services";
import {AnalyticsDetectionService, Detection} from "../http/analytics";
import {DetectionObjectModels, DetectionObjectName} from "../models";
import {MatIconModule} from "@angular/material/icon";


interface GoogleMapAdvancedMarker {
  position: google.maps.LatLngLiteral,
  title: string;
  options: google.maps.marker.AdvancedMarkerElementOptions
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MapAdvancedMarker, MatIconModule, GoogleMap],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  @ViewChild(GoogleMap, {static: true}) googleMap!: GoogleMap;

  private _geolocationService = inject(GeolocationService)
  private _analyticsDetectionService = inject(AnalyticsDetectionService)

  center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    maxZoom: 18,
    minZoom: 10,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,

  }

  protected detectionMarks: GoogleMapAdvancedMarker[] = []
  protected readonly DetectionObjectModels = DetectionObjectModels;

  ngOnInit(): void {
    this._geolocationService.getCurrentLocation().then(location => {
      this.center = {lat: location.coords.latitude, lng: location.coords.longitude}

      this._analyticsDetectionService.getDetectionInRadius(location.coords.latitude, location.coords.longitude)
        .subscribe({
          next: detections => {
            this.detectionMarks = this.mapDetectionToGoogleMark(detections);
          }
        })
    })
  }

  private mapDetectionToGoogleMark(detections: Detection[]): GoogleMapAdvancedMarker[] {
    return detections.map((detection) => {
      const position = {
        lat: detection.latitude,
        lng: detection.longitude
      };
      const title = DetectionObjectName[detection.objectId];

      const beachFlagImg = document.createElement('img');
      beachFlagImg.width = 32
      beachFlagImg.height = 32
      const iconData = this.getIconData(detection.objectId, detection.density);
      beachFlagImg.src = 'assets/icons/' + iconData.url;

      const options: google.maps.marker.AdvancedMarkerElementOptions = {
        content: beachFlagImg,
        collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
        zIndex: iconData.zIndex
      }

      return {
        title,
        position,
        options
      }
    })
  }

  private getIconData(objectId: DetectionObjectModels, density: number): {
    zIndex: number,
    url: string
  } {
    if (objectId == DetectionObjectModels.Pothole) {
      if (density >= 3) {
        return {
          url: 'pothole-danger.png',
          zIndex: 1000,
        }
      } else if (density < 3 && density > 1) {
        return {
          url: 'pothole-warning.png',
          zIndex: 10,
        }
      } else {
        return {
          url: 'pothole-good.png',
          zIndex: 1,
        }
      }
    }

    if ([DetectionObjectModels.TrafficLightGreen, DetectionObjectModels.TrafficLightRed, DetectionObjectModels.TrafficLightYellow].includes(objectId)) {
      return {
        url: 'traffic-light.png',
        zIndex: 1000,
      }
    }

    return {
      url: '',
      zIndex: 0
    }
  }
}
