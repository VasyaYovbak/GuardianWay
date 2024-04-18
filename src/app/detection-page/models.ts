import {DetectedObjectInformationWithVisualInfo} from "../models";

export enum WebWorkerMessageType {
  InitialMessage,
  DetectionMessage
}

export interface WebWorkerMessageBase {
  type: WebWorkerMessageType
}


export interface WebWorkerInitialMessage extends WebWorkerMessageBase {
  type: WebWorkerMessageType.InitialMessage
}

export interface ImageDetectionDataModel {
  image: ImageBitmap,
  predictions: DetectedObjectInformationWithVisualInfo[];
}

export interface WebWorkerDetectionMessage extends WebWorkerMessageBase {
  type: WebWorkerMessageType.DetectionMessage,
  data: ImageDetectionDataModel
}

export type WebWorkerMessage = WebWorkerInitialMessage | WebWorkerDetectionMessage;

