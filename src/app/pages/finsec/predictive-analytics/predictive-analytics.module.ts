import {NgModule} from '@angular/core';
import {FinsecModule} from '../finsec.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {PredictiveAnalyticsComponent} from './predictive-analytics.component';
import {AttackResultsModule} from './scan-results/attack-results.module';
import {AttackResultsComponent} from './scan-results/attack-results.component';

@NgModule({
            imports: [
              FinsecModule,
              Ng2SmartTableModule,
              AttackResultsModule,
            ],
            declarations: [
              PredictiveAnalyticsComponent,
            ],
            exports: [PredictiveAnalyticsComponent],
            entryComponents: [AttackResultsComponent],
          })
export class PredictiveAnalyticsModule {
}
