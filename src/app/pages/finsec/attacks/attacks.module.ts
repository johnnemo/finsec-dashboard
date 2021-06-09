import {NgModule} from '@angular/core';
import {AttacksComponent} from './attacks.component';
import {FinsecModule} from '../finsec.module';

@NgModule({
            imports: [
              FinsecModule,
            ],
            declarations: [
              AttacksComponent,
            ],
            exports: [AttacksComponent],
          })
export class AttacksModule {
}
