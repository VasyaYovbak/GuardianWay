import {Injectable} from '@angular/core';
import {DetectionUnitInfo} from "../models";

export interface Batch {
  batchId: string;
  detections: DetectionUnitInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class DetectionStorageService {
  public batch_size = 16;
  currentBatch: DetectionUnitInfo[] = [];

  saveData(unit: DetectionUnitInfo): void {
    this.currentBatch.push(unit);
    console.log('Item added to batch', unit)

    if (this.currentBatch.length >= this.batch_size) {
      const batches = this.getBatches();
      const batchId = Math.random().toString(36).substr(2, 8);
      batches.push({
        batchId: batchId,
        detections: this.currentBatch
      });
      localStorage.setItem('batches', JSON.stringify(batches));
      this.currentBatch = [];
      console.log('Batch saved!')
    }
  }

  getBatches(): Batch[] {
    const batches = localStorage.getItem('batches');
    return batches ? JSON.parse(batches) : [];
  }

  getFirstBatch(): Batch | null {
    const batches = this.getBatches();

    return batches.length ? batches[0] : null;
  }

  deleteBatch(batchId: string): void {
    let batches = this.getBatches();
    batches = batches.filter(batch => batch.batchId !== batchId);
    localStorage.setItem('batches', JSON.stringify(batches));
  }
}
