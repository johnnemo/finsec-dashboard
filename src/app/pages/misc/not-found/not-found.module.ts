import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbCardModule} from '@nebular/theme';
import {NotFoundComponent} from './not-found.component';

@NgModule({
            imports: [
              CommonModule,
              NbCardModule,
            ],
            declarations: [
              NotFoundComponent,
            ],
            exports: [NotFoundComponent],
          })
export class NotFoundModule {
}
