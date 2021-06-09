import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RefComponent} from './ref.component';

@NgModule({
            declarations: [RefComponent],
            imports: [
              CommonModule,
            ],
            exports: [RefComponent],
          })
export class RefModule {
}
