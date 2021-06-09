import {Component, EventEmitter, Input, IterableDiffers, Output} from '@angular/core';
import {DualListComponent} from 'angular-dual-listbox';

@Component({
             selector: 'finsec-dual-list-custom',
             templateUrl: './finsec-dual-list-custom.component.html',
             styleUrls: ['./finsec-dual-list-custom.component.scss'],
           })
export class FinsecDualListCustomComponent extends DualListComponent {
  @Input() sourceName = '';
  @Input() targetName = '';

  @Output() selectChange = new EventEmitter();

  constructor(differs: IterableDiffers) {
    super(differs);
  }

  moveAll() {
    this.selectAll(this.available);
    this.moveItem(this.available, this.confirmed);
  }

  removeAll() {
    this.selectAll(this.confirmed);
    this.moveItem(this.confirmed, this.available);
  }


  // Override function in DualListComponent to add custom selectChange event.
  selectItem(list: Array<any>, item: any) {
    const pk = list.filter((e: any) => {
      return Object.is(e, item);
    });
    if (pk.length > 0) {
      // Already in list, so deselect.
      for (let i = 0, len = pk.length; i < len; i += 1) {
        const idx = list.indexOf(pk[i]);
        if (idx !== -1) {
          list.splice(idx, 1);
          this.selectChange.emit({key: item._id, selected: false});
        }
      }
    } else {
      list.push(item);
      this.selectChange.emit({key: item._id, selected: true});
    }
  }

}
