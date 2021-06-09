import {NgModule} from '@angular/core';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {VulnerabilitiesComponent} from './vulnerabilities.component';
import {FinsecModule} from '../finsec.module';
import {ShowComponent} from '../../../../components/table/show/show.component';
import {ShowModule} from '../../../../components/table/show/show.module';
import {NbWindowModule} from '@nebular/theme';

@NgModule({
            imports: [
              FinsecModule,
              Ng2SmartTableModule,
              NbWindowModule.forRoot({}), ShowModule,
            ],
            declarations: [
              VulnerabilitiesComponent,
            ],
            exports: [VulnerabilitiesComponent],
            entryComponents: [ShowComponent],
          })
export class VulnerabilitiesModule {
}
