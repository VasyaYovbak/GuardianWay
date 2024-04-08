import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {getBestClassIndex, iou, transformCoordinates} from "../utils";
import {DetectedObjectInformation} from "../../models";

// import '@tensorflow/tfjs-backend-webgpu'

@Injectable({
  providedIn: 'root'
})
export abstract class DetectionModelAbstractService {
  protected model: tf.GraphModel | null = null;
  protected probabilityThreshold = 0.5;
  protected modelImageSize = 640;


  abstract loadModel(modelUrl: string): Promise<void> ;

  async predict(videoFrame: ImageBitmap): Promise<DetectedObjectInformation[] | null> {
    if (!this.model) {
      console.error('Model not loaded');
      return null;
    }

    const tensor = await this.convertVideoFramesToTensor(videoFrame);
    const prediction = this.model.predict(tensor);

    tf.dispose(tensor);

    if (!(prediction instanceof tf.Tensor)) {
      return null;
    }

    const imgWidth = videoFrame.width;
    const imgHeight = videoFrame.height;

    const framePrediction = tf.gather(prediction, 0);
    const selectedOutput = tf.transpose(framePrediction);
    const filteredBoxes = await this.filterBoxes(selectedOutput);
    let filteredOutput = await filteredBoxes.array() as number[][];

    filteredOutput.sort((a, b) => b[4] - a[4]);

    let result = [];
    while (filteredOutput.length > 0) {
      let currentBox = filteredOutput.shift();
      if (currentBox == undefined) {
        break;
      }
      result.push(currentBox);
      filteredOutput = filteredOutput.filter(box => iou(box, currentBox!) < 0.7);
    }

    const transformedBboxes = result.map(bbox => {
      const transformedBbox = transformCoordinates(bbox, imgWidth, imgHeight, this.modelImageSize, this.modelImageSize);
      const bestClassIndex = getBestClassIndex(bbox);
      return [...transformedBbox, bestClassIndex];
    });

    tf.dispose([prediction, framePrediction, selectedOutput, filteredBoxes]);

    return transformedBboxes.map(detectedObject => ({
      bbox: {
        x: detectedObject[0],
        y: detectedObject[1],
        w: detectedObject[2],
        h: detectedObject[3]
      },
      class: detectedObject[4]
    }));
  }

  disposeModel(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }

  private async convertVideoFramesToTensor(videoFrame: ImageBitmap) {
    const originalImageTensor = tf.browser.fromPixels(videoFrame);
    const resizedImageTensor = originalImageTensor.resizeBilinear([this.modelImageSize, this.modelImageSize]);
    const scalar = tf.scalar(255);
    const normalizedImageTensor = resizedImageTensor.div(scalar);
    const reshapedTensor = normalizedImageTensor.reshape([1, this.modelImageSize, this.modelImageSize, 3])

    tf.dispose([originalImageTensor, resizedImageTensor, scalar, normalizedImageTensor]);

    return reshapedTensor;
  }

  private async filterBoxes(output: any) {
    const mask = tf.tidy(() => {
      const classProbs = output.slice([0, 4], [-1, -1]);
      const maxProbs = classProbs.max(1);
      return maxProbs.greater(tf.scalar(this.probabilityThreshold));
    });

    const filteredBoxesTensor = await tf.booleanMaskAsync(output, mask);
    tf.dispose([output, mask]);
    return filteredBoxesTensor;
  }
}
