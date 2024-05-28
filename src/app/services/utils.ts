function convertToXYXY(box: number[]) {
  const [cx, cy, w, h] = box;
  return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
}

function intersection(box1: number[], box2: number[]) {
  const [box1_x1, box1_y1, box1_x2, box1_y2] = convertToXYXY(box1);
  const [box2_x1, box2_y1, box2_x2, box2_y2] = convertToXYXY(box2);

  const x1 = Math.max(box1_x1, box2_x1);
  const y1 = Math.max(box1_y1, box2_y1);
  const x2 = Math.min(box1_x2, box2_x2);
  const y2 = Math.min(box1_y2, box2_y2);

  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

function union(box1: number[], box2: number[]) {
  const [box1_x1, box1_y1, box1_x2, box1_y2] = convertToXYXY(box1);
  const [box2_x1, box2_y1, box2_x2, box2_y2] = convertToXYXY(box2);

  const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
  const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);

  return box1_area + box2_area - intersection(box1, box2);
}

export function iou(box1: number[], box2: number[]) {
  const intersect = intersection(box1, box2);
  const uni = union(box1, box2);
  return intersect / uni;
}


export function transformCoordinates(bbox: number[], origWidth: number, origHeight: number, modelWidth: number, modelHeight: number) {
  const xScale = origWidth / modelWidth;
  const yScale = origHeight / modelHeight;

  const [x1, y1, x2, y2] = bbox;
  return [x1 * xScale, y1 * yScale, x2 * xScale, y2 * yScale];
}

export function getBestClassIndex(bbox: number[]) {
  const classProbabilities = bbox.slice(4);
  return classProbabilities.indexOf(Math.max(...classProbabilities));
}
