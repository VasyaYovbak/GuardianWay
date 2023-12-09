import {Injectable} from '@angular/core';
import {fromPromise} from "rxjs/internal/observable/innerFrom";

@Injectable({
  providedIn: 'root'
})
export class WebcamConnectionService {
  createVideoStream() {
    return fromPromise(navigator.mediaDevices.getUserMedia({video: true}))
  }

  getVideoFrameTransform(callback: (frame: VideoFrame) => VideoFrame | ArrayBuffer) {
    return new TransformStream({
      async transform(videoFrame: VideoFrame, controller) {
        let transformedFrame = await callback(videoFrame);

        if (transformedFrame instanceof ArrayBuffer) {
          const bufferInit: VideoFrameBufferInit = {
            format: videoFrame.format!,
            timestamp: videoFrame.timestamp,
            codedWidth: videoFrame.codedWidth,
            codedHeight: videoFrame.codedHeight
          }

          transformedFrame = new VideoFrame(transformedFrame, bufferInit)
        }

        controller.enqueue(transformedFrame)
        videoFrame.close()
      },
    });
  }

}
