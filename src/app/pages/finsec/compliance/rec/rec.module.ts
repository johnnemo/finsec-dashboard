import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbActionsModule} from '@nebular/theme';
import {RecComponent} from './rec.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {LabelModule} from '../label/label.module';
import {MatCardModule} from '@angular/material/card';
import {RefModule} from '../ref/ref.module';

@NgModule({
            declarations: [RecComponent],
            imports: [
              CommonModule,
              NbActionsModule,
              MatExpansionModule,
              MatCardModule,
              LabelModule,
              RefModule,
            ],
            exports: [RecComponent],
          })
export class RecModule {
}
