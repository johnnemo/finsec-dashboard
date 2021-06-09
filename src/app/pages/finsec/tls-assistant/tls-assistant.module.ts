import {NgModule} from '@angular/core';
import {FinsecModule} from '../finsec.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {TlsAssistantComponent} from './tls-assistant.component';
import {ScanResultsModule} from './scan-results/scan-results.module';
import {ScanResultsComponent} from './scan-results/scan-results.component';

@NgModule({
            imports: [
              FinsecModule,
              Ng2SmartTableModule,
              ScanResultsModule,
            ],
            declarations: [
              TlsAssistantComponent,
            ],
            exports: [TlsAssistantComponent],
            entryComponents: [ScanResultsComponent],
          })
export class TlsAssistantModule {
}
