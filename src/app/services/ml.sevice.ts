import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {getBestClassIndex, iou, transformCoordinates} from "./utils";

// import '@tensorflow/tfjs-backend-webgpu'

@Injectable({
  providedIn: 'root'
})
export class MLService {
  private model: tf.GraphModel | null = null;

  private _probabilityThreshold = 0.3;

  private _modelImageSize = 640;

  constructor() {
  }

  async loadModel(modelUrl: string): Promise<void> {
    // await tf.setBackend('webgpu')
    // if (!) {
    //   await tf.setBackend('webgl')
    // }
    this.model = await tf.loadGraphModel(modelUrl);
    alert(this.model)
    console.log(this.model)
    console.log(tf.findBackend('webgpu'))
  }

  async predict(videoFrame: ImageBitmap): Promise<number[][] | null> {
    if (!this.model) {
      console.error('Model not loaded');
      return null;
    }
    const startTime = performance.now();
    const tensor = await this.convertVideoFramesToTensor(videoFrame);

    const prediction = this.model.predict(tensor);
    const endTime = performance.now();
    // console.log(endTime - startTime)
    // alert(endTime - startTime)

    tf.dispose(tensor);

    if (!(prediction instanceof tf.Tensor)) {
      return null;
    }

    const imgWidth = videoFrame.width;
    const imgHeight = videoFrame.height;

    const framePrediction = tf.gather(prediction, 0);
    const selectedOutput = tf.transpose(framePrediction);
    tf.dispose(framePrediction);

    const filteredBoxes = await this.filterBoxes(selectedOutput);
    tf.dispose(selectedOutput);

    let filteredOutput = await filteredBoxes.array() as number[][];
    tf.dispose(filteredBoxes);

    filteredOutput.sort((a, b) => b[4] - a[4]);

    let result = [];
    while (filteredOutput.length > 0) {
      let currentBox = filteredOutput.shift();
      if (currentBox == undefined) {
        break;
      }
      result.push(currentBox);
      filteredOutput = filteredOutput.filter(box => iou(box, currentBox!) < 0.5);
    }

    const transformedBboxes = result.map(bbox => {
      const transformedBbox = transformCoordinates(bbox, imgWidth, imgHeight, this._modelImageSize, this._modelImageSize);
      const bestClassIndex = getBestClassIndex(bbox);
      return [...transformedBbox, bestClassIndex];
    });

    tf.dispose(prediction);
    // console.log(transformedBboxes.length)


    return transformedBboxes;
  }

  disposeModel(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }

  private async convertVideoFramesToTensor(videoFrame: ImageBitmap) {
    const originalImageTensor = tf.browser.fromPixels(videoFrame);
    const resizedImageTensor = originalImageTensor.resizeBilinear([this._modelImageSize, this._modelImageSize]);
    const scalar = tf.scalar(255);
    const normalizedImageTensor = resizedImageTensor.div(scalar);
    const reshapedTensor = normalizedImageTensor.reshape([1, this._modelImageSize, this._modelImageSize, 3])

    tf.dispose([originalImageTensor, resizedImageTensor, scalar, normalizedImageTensor]);

    return reshapedTensor;
  }

  private async filterBoxes(output: any) {
    const mask = tf.tidy(() => {
      const classProbs = output.slice([0, 4], [-1, -1]);
      const maxProbs = classProbs.max(1);
      return maxProbs.greater(tf.scalar(this._probabilityThreshold));
    });

    const filteredBoxesTensor = await tf.booleanMaskAsync(output, mask);
    tf.dispose([output, mask]);
    return filteredBoxesTensor;
  }
}
