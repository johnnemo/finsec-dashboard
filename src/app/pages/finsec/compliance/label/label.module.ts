import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbActionsModule} from '@nebular/theme';
import {LabelComponent} from './label.component';

@NgModule({
            declarations: [LabelComponent],
            imports: [
              CommonModule,
              NbActionsModule,
            ],
            exports: [LabelComponent],
          })
export class LabelModule {
}
