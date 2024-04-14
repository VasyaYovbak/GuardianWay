import {Injectable} from '@angular/core';
import {DetectionModelAbstractService} from "./ml.sevice";
import * as tf from "@tensorflow/tfjs";

@Injectable({
  providedIn: 'root'
})
export class TrafficLightDetectionModelService extends DetectionModelAbstractService {
  async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadGraphModel('assets/models/traffic-smaller-640-tfjs-fp16/model.json');
      console.log('Traffic light detection model successfully loaded', this.model)
    } catch (e) {
      console.error('Something went wrong when downloading traffic light model', e)
    }
  }
}
