import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbActionsModule} from '@nebular/theme';
import {AuditResultsComponent} from './audit-results.component';

@NgModule({
            declarations: [AuditResultsComponent],
            imports: [
              CommonModule,
              NbActionsModule,
            ],
            exports: [AuditResultsComponent],
          })
export class AuditResultsModule {
}
