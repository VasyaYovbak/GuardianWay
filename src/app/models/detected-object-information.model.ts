export interface ObjectBBOX {
  x: number,
  y: number,
  w: number,
  h: number
}

export interface DetectedObjectInformation {
  bbox: ObjectBBOX,
  class: number
}

export interface DetectedObjectInformationWithVisualInfo extends DetectedObjectInformation {
  color: string,
  label: string
}

export interface DetectionUnitInfo {
  location: GeolocationCoordinates,
  timestamp: string,
  object_id: number,
  density: number
}
