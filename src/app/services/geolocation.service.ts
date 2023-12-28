import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      } else {
        reject(new Error('Геолокація не підтримується вашим браузером.'));
      }
    });
  }
}
