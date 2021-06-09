import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-scan-results',
             changeDetection: ChangeDetectionStrategy.OnPush,
             templateUrl: './action-status.component.html',
             styleUrls: ['./action-status.component.scss'],
           })
export class ActionStatusComponent implements OnInit {

  @Input() value: any;
  @Input() rowData: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
