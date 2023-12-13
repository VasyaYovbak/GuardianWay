import {Injectable} from '@angular/core';
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: 'root'
})
export class WebcamConnectionService {
  createVideoStream(constraint: MediaStreamConstraints) {
    return fromPromise(navigator.mediaDevices.getUserMedia(constraint))
  }

  getVideoFrameTransform(callback: (frame: VideoFrame) => Promise<VideoFrame | Uint8Array>) {
    return new TransformStream({
      async transform(videoFrame: VideoFrame, controller) {
        let transformedFrame = await callback(videoFrame);

        if (transformedFrame instanceof Uint8Array) {
          const bufferInit: VideoFrameBufferInit = {
            format: 'RGBA',
            timestamp: videoFrame.timestamp,
            codedWidth: videoFrame.codedWidth,
            codedHeight: videoFrame.codedHeight
          }

          transformedFrame = new VideoFrame(transformedFrame, bufferInit)
        }

        videoFrame.close()

        controller.enqueue(transformedFrame)
      },
    });
  }

}
