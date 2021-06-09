import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinsecTableComponent} from './table/finsec.table.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NbAlertModule, NbButtonModule, NbCardModule, NbIconModule, NbListModule} from '@nebular/theme';
import {NgxEchartsModule} from 'ngx-echarts';
import {VisualizeComponent} from './visualize/visualize.component';
import {TreeComponent} from './tree/tree.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Bootstrap4FrameworkModule, MaterialDesignFrameworkModule, NoFrameworkModule} from 'angular6-json-schema-form';
import {FormComponent} from './form/form.component';
import {FinsecDualListComponent} from './finsec-dual-list/finsec-dual-list.component';
import {FinsecDualListCustomComponent} from './finsec-dual-list/finsec-dual-list-custom/finsec-dual-list-custom.component';
import {FinsecTableModule} from './table/finsec.table.module';
import {ShowComponent} from './show/show.component';

@NgModule({
            declarations: [
              FinsecTableComponent,
              VisualizeComponent,
              TreeComponent,
              FormComponent,
              FinsecDualListComponent,
              FinsecDualListCustomComponent,
              ShowComponent,
            ],
            imports: [
              CommonModule,
              Ng2SmartTableModule,
              NbCardModule,
              NbListModule,
              NbIconModule,
              NbAlertModule,
              NbButtonModule,
              NgxEchartsModule,
              FormsModule,
              ReactiveFormsModule,
              MaterialDesignFrameworkModule,
              NoFrameworkModule,
              Bootstrap4FrameworkModule,
              FinsecTableModule,

            ],
            /*
            TODO: figure out why it needs both declarations and exports
            */
            exports: [
              VisualizeComponent,
              FinsecTableComponent,
              TreeComponent,
              FormComponent,
              FinsecDualListComponent,
              FinsecDualListCustomComponent,
            ],
          })
export class FinsecVisualizeModule {

}
