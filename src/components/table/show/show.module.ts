import {NgModule} from '@angular/core';
import {ShowComponent} from './show.component';
import {CommonModule} from '@angular/common';
import {NbButtonModule} from "@nebular/theme";

@NgModule({
            imports: [
              CommonModule,
              NbButtonModule,
            ],
            declarations: [
              ShowComponent,
            ],
            exports: [ShowComponent],

          })
export class ShowModule {
}
