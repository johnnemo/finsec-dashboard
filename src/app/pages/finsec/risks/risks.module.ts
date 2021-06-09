import {NgModule} from '@angular/core';
import {RisksComponent} from './risks.component';
import {FinsecModule} from '../finsec.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ShowModule} from '../../../../components/table/show/show.module';
import {NbWindowModule} from '@nebular/theme';
import {ShowComponent} from '../../../../components/table/show/show.component';

@NgModule({
            imports: [
              FinsecModule,
              Ng2SmartTableModule,
              NbWindowModule.forRoot({}), ShowModule,
            ],
            declarations: [
              RisksComponent,
            ],
            exports: [RisksComponent],
            entryComponents: [ShowComponent],
          })
export class RisksModule {
}
