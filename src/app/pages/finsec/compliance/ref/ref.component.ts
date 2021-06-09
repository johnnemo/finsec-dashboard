import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChangeTabService} from './changeTab.service';

@Component({
             selector: 'ref',
             template: `
               <span *ngIf="!reference.location">
                 {{ reference.x_ref_id }}
               </span>
               <span (click)="changeTab(2)" *ngIf="reference.location">
                 {{ reference.x_ref_id }},
                 {{ reference.location.join(", ") }}
               </span>
             `,
             styleUrls: ['./ref.component.scss'],
           })
export class RefComponent implements OnInit {
  @Input() reference: any;
  @Output() tabNumber = new EventEmitter<number>();

  constructor(private changeTabService: ChangeTabService) {
  }

  ngOnInit() {
  }

  public changeTab(value: number) {
    this.changeTabService.setValue(value);
  }

}
