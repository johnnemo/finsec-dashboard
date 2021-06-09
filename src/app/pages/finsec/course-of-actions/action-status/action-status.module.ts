import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbActionsModule} from '@nebular/theme';
import {ActionStatusComponent} from './action-status.component';

@NgModule({
            declarations: [ActionStatusComponent],
            imports: [
              CommonModule,
              NbActionsModule,
            ],
            exports: [ActionStatusComponent],
          })
export class ActionStatusModule {
}
