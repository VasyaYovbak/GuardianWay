import {Injectable} from '@angular/core';
import {DetectionModelAbstractService} from "./ml.sevice";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu"
import {DetectedObjectInformation, DetectedObjectInformationWithVisualInfo} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class PotholeDetectionModelService extends DetectionModelAbstractService {
  override probabilityThreshold = 0.3;
  override iou = 0.15;

  async loadModel(): Promise<void> {
    await tf.setBackend('webgpu');

    try {
      this.model = await tf.loadGraphModel('assets/models/best-pothole-half-simplify-tfjs-uint8/model.json');
      console.log('Pothole detection model successfully loaded', this.model)
    } catch (e) {
      console.error('Something went wrong when downloading pothole model', e)
    }
  }

  // override async convertVideoFramesToTensor(videoFrame: ImageBitmap) {
  //   const originalImageTensor = tf.browser.fromPixels(videoFrame);
  //   const resizedImageTensor = originalImageTensor.resizeBilinear([this.modelImageSize, this.modelImageSize]);
  //   const scalar = tf.scalar(255);
  //   const normalizedImageTensor = resizedImageTensor.div(scalar);
  //
  //   const grayscale = normalizedImageTensor.mean(2).expandDims(2);
  //   const mid = tf.scalar(0.5);
  //   const contrast = tf.scalar(1.5)
  //   const adjusted = grayscale.sub(mid).mul(contrast).add(mid);
  //   const clipped = adjusted.clipByValue(0, 1);
  //
  //
  //   const reshapedTensor = clipped.reshape([1, this.modelImageSize, this.modelImageSize, 1])
  //
  //   tf.dispose([grayscale, mid, contrast, adjusted, clipped]);
  //   tf.dispose([originalImageTensor, resizedImageTensor, scalar, normalizedImageTensor]);
  //
  //   return reshapedTensor;
  // }

  getVisualInfoFromPredictions(predictions: DetectedObjectInformation[]): DetectedObjectInformationWithVisualInfo[] {
    return predictions.map(pred => ({
      ...pred,
      color: 'orange',
      label: 'pothole'
    }));
  }
}
