import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-scan-results',
             changeDetection: ChangeDetectionStrategy.OnPush,
             templateUrl: './attack-results.component.html',
             styleUrls: ['./attack-results.component.scss'],
           })
export class AttackResultsComponent implements OnInit {

  @Input() value: any;
  @Input() rowData: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
