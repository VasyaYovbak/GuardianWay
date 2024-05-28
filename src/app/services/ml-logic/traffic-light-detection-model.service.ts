import {Injectable} from '@angular/core';
import {DetectionModelAbstractService} from "./ml.sevice";
import * as tf from "@tensorflow/tfjs";
import {DetectedObjectInformation, DetectedObjectInformationWithVisualInfo} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class TrafficLightDetectionModelService extends DetectionModelAbstractService {
  override iou = 0.4;
  override probabilityThreshold = 0.2;

  async loadModel(): Promise<void> {
    try {
      await tf.ready();
      await tf.setBackend('webgpu');
      this.model = await tf.loadGraphModel('assets/models/traffic-small-640-tfjs-uint8/model.json');
      console.log('Traffic light detection model successfully loaded', this.model)
    } catch (e) {
      console.error('Something went wrong when downloading traffic light model', e)
    }
  }

  getVisualInfoFromPredictions(predictions: DetectedObjectInformation[]): DetectedObjectInformationWithVisualInfo[] {
    return predictions.map(pred => {
      let color, label, classId;
      switch (pred.class) {
        case 0: {
          color = 'green';
          label = 'traffic_green';
          classId = 1;
          break;
        }
        case 1: {
          color = 'red';
          label = 'traffic_red'
          classId = 2;
          break;
        }
        case 2: {
          color = 'yellow';
          label = 'traffic_yellow'
          classId = 3;
          break;
        }
        default: {
          color = 'red';
          classId = 1;
          label = 'traffic_red'
        }
      }

      return {
        ...pred,
        label,
        color,
        class: classId
      }
    });
  }
}
