import {NgModule} from '@angular/core';
import {AreasComponent} from './areas.component';
import {FinsecModule} from "../finsec.module";

@NgModule({
            imports: [
              FinsecModule
            ],
            declarations: [
              AreasComponent,
            ],
            exports: [AreasComponent]
          })
export class AreasModule {
}
