import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbActionsModule} from '@nebular/theme';
import {ScanResultsComponent} from './scan-results.component';

@NgModule({
            declarations: [ScanResultsComponent],
            imports: [
              CommonModule,
              NbActionsModule,
            ],
            exports: [ScanResultsComponent],
          })
export class ScanResultsModule {
}
