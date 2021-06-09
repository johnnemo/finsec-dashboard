import {NgModule} from '@angular/core';
import {ComplianceComponent} from './compliance.component';
import {FinsecModule} from '../finsec.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {LabelModule} from './label/label.module';
import {RecModule} from './rec/rec.module';
import { RefComponent } from './ref/ref.component';
import {ChangeTabService} from './ref/changeTab.service';

@NgModule({
            declarations: [ComplianceComponent],
            imports: [
              FinsecModule,
              Ng2SmartTableModule,
              NgxJsonViewerModule,
              MatTabsModule,
              MatTableModule,
              MatSortModule,
              MatCardModule,
              MatListModule,
              LabelModule,
              RecModule,
            ],
            exports: [ComplianceComponent],
            providers: [ChangeTabService],
          })
export class ComplianceModule {
}
