import {NgModule} from '@angular/core';
import {ServicesComponent} from './services.component';
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
              ServicesComponent,
            ],
            exports: [ServicesComponent],
            entryComponents: [ShowComponent],
          })
export class ServicesModule {
}
