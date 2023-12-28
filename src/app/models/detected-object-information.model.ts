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
