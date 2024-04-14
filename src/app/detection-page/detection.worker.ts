/// <reference lib="webworker" />
const {PotholeDetectionModelService} = require('../services/ml-logic/pothole-detection-model.service')

const pD = new PotholeDetectionModelService();
pD.loadModel();

addEventListener('message', async ({data}) => {
  const image = data;

  // const predictions = await potholeDetector.predict(image);
  console.log(pD)
  const predictions: any[] = [];

  postMessage({image, predictions});
});

