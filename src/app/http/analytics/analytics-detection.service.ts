import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BE_HTTP_API_URL} from "../../global.variables";
import {Detection} from "./models";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsDetectionService {
  private _http = inject(HttpClient);

  getDetectionInRadius(latitude: number, longitude: number) {
    const params = new HttpParams({fromObject: {latitude, longitude}});

    return this._http.get<Detection[]>(BE_HTTP_API_URL + '/analytics/detections', {params})
  }
}
