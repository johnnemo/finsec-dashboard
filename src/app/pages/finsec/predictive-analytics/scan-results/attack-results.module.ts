import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbActionsModule} from '@nebular/theme';
import {AttackResultsComponent} from './attack-results.component';

@NgModule({
            declarations: [AttackResultsComponent],
            imports: [
              CommonModule,
              NbActionsModule,
            ],
            exports: [AttackResultsComponent],
          })
export class AttackResultsModule {
}
