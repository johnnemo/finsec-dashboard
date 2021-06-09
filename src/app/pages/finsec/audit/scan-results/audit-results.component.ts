import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-scan-results',
             changeDetection: ChangeDetectionStrategy.OnPush,
             templateUrl: './audit-results.component.html',
             styleUrls: ['./audit-results.component.scss'],
           })
export class AuditResultsComponent implements OnInit {

  @Input() value: any; // data from table
  @Input() rowData: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
