import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinsecDualListCustomModule} from './finsec-dual-list-custom/finsec-dual-list-custom.module';

@NgModule({
            imports: [
              CommonModule,
              FinsecDualListCustomModule,
            ],
          })
export class FinsecDualListModule {
}
