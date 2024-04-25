import {inject, Injectable} from '@angular/core';
import {BE_SOCKETS_API} from "../../global.variables";
import {SocketAuth} from "../socket-auth/socket-auth.service";
import {DetectionStorageService} from "../../services/detection-storage.service";
import {interval, Subscription} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DetectionHubService {
  private _socketAuth = inject(SocketAuth);
  private _detectionStorageService = inject(DetectionStorageService);

  private _autoSavingStream$: Subscription | null = null;


  connectToHub() {
    this._socketAuth.initSocket(BE_SOCKETS_API, {withCredentials: true, reconnection: false});

    this._socketAuth.socket.on('batch_saved', (batchId: string) => {
      console.log(batchId);
      this._detectionStorageService.deleteBatch(batchId);
    });

    this._autoSavingStream$ = interval(4000).subscribe({
      next: () => {
        this.sendMessage();
      }
    })

    this._socketAuth.socket.on('disconnect', () => this._autoSavingStream$?.unsubscribe());
  }

  sendMessage() {
    const data = this._detectionStorageService.getFirstBatch();
    if (data) {
      this._socketAuth.socket.emit('detection_batch', data);
      return;
    }

    console.log('Skipped')
  }

  disconnectFromHub() {
    this._socketAuth.socket.disconnect();
  }
}
