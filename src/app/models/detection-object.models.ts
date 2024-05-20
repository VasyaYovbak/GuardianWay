export enum DetectionObjectModels {
  Pothole = 1,
  TrafficLightGreen = 2,
  TrafficLightRed = 3,
  TrafficLightYellow = 4,
}

export const DetectionObjectName: { [key in DetectionObjectModels]: string } = {
  [DetectionObjectModels.Pothole]: 'Pothole',
  [DetectionObjectModels.TrafficLightRed]: 'Red TrafficLight',
  [DetectionObjectModels.TrafficLightGreen]: 'Green TrafficLight',
  [DetectionObjectModels.TrafficLightYellow]: 'Yellow TrafficLight',
}
