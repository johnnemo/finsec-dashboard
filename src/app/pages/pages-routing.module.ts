import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AssetsComponent} from './finsec/assets/assets.component';
import {EventsComponent} from './finsec/events/events.component';
import {OrganizationsComponent} from './finsec/organizations/organizations.component';
import {AreasComponent} from './finsec/areas/areas.component';
import {AuthGuard} from '../@core/services/shared/guard';
import {ProbesComponent} from './finsec/probes/probes.component';
import {AttacksComponent} from './finsec/attacks/attacks.component';
import {VulnerabilitiesComponent} from './finsec/vulnerabilities/vulnerabilities.component';
import {ServicesComponent} from './finsec/services/services.component';
import {RisksComponent} from './finsec/risks/risks.component';
import {TlsAssistantComponent} from './finsec/tls-assistant/tls-assistant.component';
import {PredictiveAnalyticsComponent} from './finsec/predictive-analytics/predictive-analytics.component';
import {CourseOfActionsComponent} from './finsec/course-of-actions/course-of-actions.component';
import {AuditComponent} from './finsec/audit/audit.component';
import {NotFoundComponent} from './misc/not-found/not-found.component';
import {RegulationsComponent} from './finsec/regulations/regulations.component';
import {TtpsComponent} from './finsec/ttps/ttps.component';
import {ComplianceComponent} from './finsec/compliance/compliance.component';
import {TransactionsComponent} from "./finsec/transactions/transactions.component";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'organizations',
        component: OrganizationsComponent,
      },
      {
        path: 'assets',
        component: AssetsComponent,
      },
      {
        path: 'areas',
        component: AreasComponent,
      },
      {
        path: 'probes',
        component: ProbesComponent,
      },
      {
        path: 'events',
        component: EventsComponent,
      },
      {
        path: 'attacks',
        component: AttacksComponent,
      },
      {
        path: 'vulnerabilities',
        component: VulnerabilitiesComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      },
      {
        path: 'risks',
        component: RisksComponent,
      },
      {
        path: 'tls-scan',
        component: TlsAssistantComponent,
      },
      {
        path: 'audit',
        component: AuditComponent,
      },
      {
        path: 'compliance-reports',
        component: ComplianceComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'attacks',
        children: [
          {path: 'predicted', component: PredictiveAnalyticsComponent},
          {path: 'detected', component: PredictiveAnalyticsComponent},
        ],
      },
      {
        path: 'detected-attacks',
        component: PredictiveAnalyticsComponent,
      },
      {
        path: 'course-of-actions',
        component: CourseOfActionsComponent,
      },
      {
        path: 'regulations',
        component: RegulationsComponent,
      },
      {
        path: 'ttps',
        component: TtpsComponent,
      },
      {
        path: 'layout',
        loadChildren: () => import('./layout/layout.module')
          .then(m => m.LayoutModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule],
          })
export class PagesRoutingModule {
}
