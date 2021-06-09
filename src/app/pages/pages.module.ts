import {NgModule} from '@angular/core';
import {NbMenuModule} from '@nebular/theme';

import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {PagesRoutingModule} from './pages-routing.module';
import {AssetsModule} from './finsec/assets/assets.module';
import {ProbesModule} from './finsec/probes/probes.module';
import {EventsModule} from './finsec/events/events.module';
import {OrganizationsModule} from './finsec/organizations/organizations.module';
import {AreasModule} from './finsec/areas/areas.module';
import {AttacksModule} from './finsec/attacks/attacks.module';
import {VulnerabilitiesModule} from './finsec/vulnerabilities/vulnerabilities.module';
import {ServicesModule} from './finsec/services/services.module';
import {RisksModule} from './finsec/risks/risks.module';
import {TlsAssistantModule} from './finsec/tls-assistant/tls-assistant.module';
import {PredictiveAnalyticsModule} from './finsec/predictive-analytics/predictive-analytics.module';
import {CourseOfActionsModule} from './finsec/course-of-actions/course-of-actions.module';
import {NotFoundModule} from './misc/not-found/not-found.module';
import {AuditModule} from './finsec/audit/audit.module';
import {RegulationsModule} from './finsec/regulations/regulations.module';
import {TtpsModule} from './finsec/ttps/ttps.module';
import {ComplianceModule} from './finsec/compliance/compliance.module';
import {TransactionsModule} from "./finsec/transactions/transactions.module";

@NgModule({
            imports: [
              PagesRoutingModule,
              ThemeModule,
              NbMenuModule,
              DashboardModule,
              OrganizationsModule,
              AssetsModule,
              AreasModule,
              ProbesModule,
              RegulationsModule,
              TtpsModule,
              EventsModule,
              AttacksModule,
              VulnerabilitiesModule,
              TlsAssistantModule,
              TransactionsModule,
              PredictiveAnalyticsModule,
              ServicesModule,
              RisksModule,
              CourseOfActionsModule,
              AuditModule,
              ComplianceModule,
              NotFoundModule,
            ],
            declarations: [
              PagesComponent,
            ],
          })
export class PagesModule {
}
