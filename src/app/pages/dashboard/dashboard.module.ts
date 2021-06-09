import {NgModule} from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbListModule,
  NbProgressBarModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbUserModule,
} from '@nebular/theme';
import {NgxEchartsModule} from 'ngx-echarts';

import {ThemeModule} from '../../@theme/theme.module';
import {DashboardComponent} from './dashboard.component';
import {FormsModule} from '@angular/forms';
import {AssetsComponent} from "./assets/assets.component";
import {AttacksComponent} from "./attacks/attacks.component";
import {RiskTrendComponent} from "./risk-trend/risk-trend.component";
import {VulnerabilitiesComponent} from "./vulnerabilities/vulnerabilities.component";
import {EventsComponent} from "./events/events.component";
import {Ng2SmartTableModule} from "ng2-smart-table";

@NgModule({
            imports: [
              FormsModule,
              ThemeModule,
              NbCardModule,
              NbUserModule,
              NbButtonModule,
              NbTabsetModule,
              NbActionsModule,
              NbRadioModule,
              NbSelectModule,
              NbListModule,
              NbProgressBarModule,
              NbIconModule,
              NbButtonModule,
              NgxEchartsModule,
              Ng2SmartTableModule,
            ],
            declarations: [
              DashboardComponent,
              AssetsComponent,
              AttacksComponent,
              RiskTrendComponent,
              VulnerabilitiesComponent,
              EventsComponent
            ],
          })
export class DashboardModule {
}
