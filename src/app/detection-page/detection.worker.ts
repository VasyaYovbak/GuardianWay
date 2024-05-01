/// <reference lib="webworker" />
// @ts-ignore
const {PotholeDetectionModelService} = require('../services/ml-logic/pothole-detection-model.service')
// @ts-ignore
const {TrafficLightDetectionModelService} = require('../services/ml-logic/traffic-light-detection-model.service')

// @ts-ignore
const {WebWorkerMessageType} = require('./models')

const potholeDetector = new PotholeDetectionModelService();
// const trafficDetector = new TrafficLightDetectionModelService();

Promise.all([potholeDetector.loadModel()]).then(() => {
  const initialMessage = {
    type: WebWorkerMessageType.InitialMessage
  };

  postMessage(initialMessage);
});

addEventListener('message', async ({data}) => {
  const predictions_potholes = potholeDetector.getVisualInfoFromPredictions(await potholeDetector.predict(data));
  // const predictions_traffic = trafficDetector.getVisualInfoFromPredictions(await trafficDetector.predict(data));


  const detectionMessage = {
    type: WebWorkerMessageType.DetectionMessage,
    // data: {image: data, predictions: predictions_potholes?.concat(predictions_traffic)}
    data: {image: data, predictions: predictions_potholes}
  };
  postMessage(detectionMessage);
});

