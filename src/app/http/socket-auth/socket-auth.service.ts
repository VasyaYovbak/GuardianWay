import {inject, Injectable} from '@angular/core';
import {io, ManagerOptions, Socket, SocketOptions} from "socket.io-client";
import {JwtService} from "../jwt";

@Injectable({
  providedIn: 'root'
})
export class SocketAuth {
  public socket!: Socket;
  private _jwtService = inject(JwtService);

  initSocket(uri: string, opts?: Partial<ManagerOptions & SocketOptions>) {
    this.socket = io(uri, {...opts, extraHeaders: {'Authorization': "Bearer " + this._jwtService.getAccessToken()}});

    this.socket.on('disconnect', () => {
      this.socket.close();
      this._jwtService.refreshJWT().subscribe({
        next: () => {
          this.socket.connect()
        },
      })
    });
  }
}
