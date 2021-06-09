import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({
              providedIn: 'root',
            })
export class TargetService {
  private itemTarget = new BehaviorSubject<any>({});

  // Observable string streams
  target$ = this.itemTarget.asObservable();

  constructor() {
  }

  // Service message commands
  addItem(item: any) {
    this.itemTarget.next(item);
  }
}
