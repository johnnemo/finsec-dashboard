import {RouterModule} from '@angular/router';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbStepperModule,
  NbThemeModule,
  NbTreeGridModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxEchartsModule} from 'ngx-echarts';
import {ThemeModule} from '../../@theme/theme.module';
import {FinsecVisualizeModule} from '../../../components/finsec.visualize.module';
import {NotificationsComponent} from './notifications/notifications.component';

@NgModule({
            declarations: [NotificationsComponent],
            imports: [
              RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
              NbLayoutModule,
              NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
              NbButtonModule,
              NbThemeModule,
              ThemeModule,
              NbMenuModule,
              NbUserModule,
              NbActionsModule,
              NbSearchModule,
              NbCardModule,
              NgxEchartsModule,
              CommonModule,
              NbTreeGridModule,
              NbIconModule,
              NbSelectModule,
              FinsecVisualizeModule,
              NbStepperModule,
            ],
            exports: [
              RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
              NbLayoutModule,
              NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
              NbButtonModule,
              NbThemeModule,
              ThemeModule,
              NbMenuModule,
              NbUserModule,
              NbActionsModule,
              NbSearchModule,
              NbCardModule,
              NgxEchartsModule,
              CommonModule,
              NbTreeGridModule,
              NbWindowModule,
              NbIconModule,
              NbSelectModule,
              FinsecVisualizeModule,
              NbStepperModule,
            ],

          })
export class FinsecModule {
}
