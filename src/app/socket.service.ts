// import { Injectable } from '@angular/core';
// import {io, Socket} from 'socket.io-client';
// import {Observable, Subject} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class SocketService {
//
//   socket: Socket;
//
//   constructor() {
//     this.socket = io();
//
//     this.socket.on('connect', () => {
//       // @ts-ignore
//       console.log('Web Socket Connected with ID: ' + this.socket.id);
//     });
//
//     this.socket.on('disconnect', () => {
//       // @ts-ignore
//       console.log('Web Socket Disconnected with ID: ' + this.socket.id);
//     });
//   }
//
//   registerMultiple(eventMapping: Map<string, CallableFunction>): Subject<Object> {
//     const subject = new Subject<Object>();
//     console.log('registering MultiEvent');
//     this.socket.onAny((event, data) => {
//       console.log('any', event, data);
//       if (eventMapping.has(event)) {
//         console.log('match event, forwarding', data);
//         subject.next({ ...data, title: eventMapping.get(event)(data) });
//       }
//     });
//
//     return subject;
//   }
//
//   // TODO removeMultiple?
//
//   registerListener(event: string, callback: CallableFunction) {
//     return this.socket.on(event, callback);
//   }
//
//   removeListener(event: string, callback: CallableFunction) {
//     return this.socket.off(event, callback);
//   }
//
// }
