import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
             selector: 'ngx-scan-results',
             changeDetection: ChangeDetectionStrategy.OnPush,
             templateUrl: './scan-results.component.html',
             styleUrls: ['./scan-results.component.scss'],
           })
export class ScanResultsComponent implements OnInit, ViewCell {
  @Input() value: any;
  @Input() rowData: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
