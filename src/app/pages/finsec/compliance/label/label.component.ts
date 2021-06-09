import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'lab',
             template: `
               <b>
                 <ng-content></ng-content>
                 : </b>
             `,
             styles: [],
           })
export class LabelComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
