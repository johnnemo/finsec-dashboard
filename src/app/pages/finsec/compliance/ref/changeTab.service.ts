import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
              providedIn: 'root',
            })
export class ChangeTabService {

  private subj = new Subject();
  public subj$ = this.subj.asObservable();

  constructor() {
  }

  setValue(value) {
    this.subj.next(value);
  }
}
