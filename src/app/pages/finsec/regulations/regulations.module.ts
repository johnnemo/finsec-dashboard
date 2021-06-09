import {NgModule} from '@angular/core';
import {FinsecModule} from '../finsec.module';
import {RegulationsComponent} from './regulations.component';

@NgModule({
            imports: [
              FinsecModule,
            ],
            declarations: [
              RegulationsComponent,
            ],
            exports: [RegulationsComponent],
          })
export class RegulationsModule {
}
