import {NgModule} from '@angular/core';
import {ProbesComponent} from './probes.component';
import {FinsecModule} from '../finsec.module';

@NgModule({
            imports: [
              FinsecModule,
            ],
            declarations: [
              ProbesComponent,
            ],
            exports: [ProbesComponent],
          })
export class ProbesModule {
}
