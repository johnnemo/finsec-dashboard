import {NgModule} from '@angular/core';
import {AssetsComponent} from './assets.component';
import {FinsecModule} from "../finsec.module";

@NgModule({
            imports: [
              FinsecModule
            ],
            declarations: [
              AssetsComponent,
            ],
            exports: [AssetsComponent]
          })
export class AssetsModule {
}
