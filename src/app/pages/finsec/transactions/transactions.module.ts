import {NgModule} from '@angular/core';
import {FinsecModule} from '../finsec.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {TransactionsComponent} from './transactions.component';

@NgModule({
            imports: [
              FinsecModule,
              Ng2SmartTableModule,
            ],
            declarations: [
                TransactionsComponent,
            ],
            exports: [TransactionsComponent],
          })
export class TransactionsModule {
}
