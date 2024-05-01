import {Injectable} from '@angular/core';
import {DetectionModelAbstractService} from "./ml.sevice";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu"
import {DetectedObjectInformation, DetectedObjectInformationWithVisualInfo} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class PotholeDetectionModelService extends DetectionModelAbstractService {
  override probabilityThreshold = 0.2;
  override iou = 0.15;

  async loadModel(): Promise<void> {
    await tf.setBackend('webgpu');

    try {
      this.model = await tf.loadGraphModel('assets/models/best-pothole-640-tfjs-uint8/model.json');
      console.log('Pothole detection model successfully loaded', this.model)
    } catch (e) {
      console.error('Something went wrong when downloading pothole model', e)
    }
  }

  getVisualInfoFromPredictions(predictions: DetectedObjectInformation[]): DetectedObjectInformationWithVisualInfo[] {
    return predictions.map(pred => ({
      ...pred,
      color: 'orange',
      label: 'pothole'
    }));
  }
}
