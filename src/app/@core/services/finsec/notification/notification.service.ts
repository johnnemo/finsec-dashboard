import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Notification} from "../../../../shared/model/notification";
import Pusher from "pusher-js";

@Injectable({
              providedIn: 'root',
            })
export class NotificationService {
  private subject: Subject<Notification> = new Subject<Notification>();

  private pusherClient: Pusher;

  constructor() {
    this.pusherClient = new Pusher('something', {
      cluster: 'mt1',
      // broadcaster: 'pusher',
      // key: 'something',
      wsHost: '127.0.0.1',
      authEndpoint: 'http://127.0.0.1/broadcasting/auth',
      httpHost: '127.0.0.1',
      wsPort: 6002,
      disableStats: true,
      auth: {
        params: null,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      }
    });

    // we first need to create the user
    // Plan the object to be created and apply it in the backend application (e.g. new attack-pattern / I would say to play with events for now)
    // migrations, model, event and notifications should be written to support it
    // then write the notification code same as the mitigate project
    // then create a notification by creating a new object
    // then create the notifications object and make it polymorphic
    // then brainstorm on how it can be achieved for organizations
    // then to start the application
    // then start the websockets server
    // then pop from queue
    // then create the object (automatically the notification) and automatically should be consumed
    // then apply the read_at functionality
    const channel = this.pusherClient.subscribe('private-App.User.83112ad7-032a-4791-a7b9-48efef029f5c');// + sessionStorage.getItem('x_organization'));
    channel.bind(
      'Illuminate\\Notifications\\Events\\BroadcastNotificationCreated',
      (data: { data: { id: string, description: string, subtype: string, details: any, name: string, created: string, modified: string, domain: string } }) => {
        this.subject.next(new Notification(data.data.id,
                                           data.data.description,
                                           data.data.subtype,
                                           data.data.details,
                                           data.data.name,
                                           data.data.created,
                                           data.data.modified,
                                           data.data.domain));
      }
    );
  }

  getNotificationItems(): Observable<Notification> {
    return this.subject.asObservable();
  }
}
