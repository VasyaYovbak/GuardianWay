import {DetectionObjectModels} from "../../models";

export interface Detection {
  density: number,
  latitude: number,
  longitude: number,
  objectId: DetectionObjectModels,
}
