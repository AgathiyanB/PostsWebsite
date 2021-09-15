import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  readonly ROOT_URL;

  constructor() {
    this.ROOT_URL = environment.socketURL
  }

  getSocket(namespace: string, payload: Object) {
    return io(`${this.ROOT_URL}/${namespace}`,payload)
  }

  getSocketAsObservable(namespace: string, payload: Object, event: string) {
    const observable = new Subject<string>()
    io(`${this.ROOT_URL}/${namespace}`,payload).on(event,data => {
      observable.next(data)
    })
  }
}
