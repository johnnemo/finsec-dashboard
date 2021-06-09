import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({
              providedIn: 'root',
            })
export class ItemDetailService {
  private itemSource = new BehaviorSubject<any>({});

  // Observable string streams
  itemDetailed$ = this.itemSource.asObservable();

  constructor() {
  }

  // Service message commands
  addItem(item: any) {
    this.itemSource.next(item);
  }
}
