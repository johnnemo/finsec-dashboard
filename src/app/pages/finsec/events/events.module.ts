import {NgModule} from '@angular/core';
import {EventsComponent} from './events.component';
import {FinsecModule} from '../finsec.module';

@NgModule({
            imports: [
              FinsecModule,
            ],
            declarations: [
              EventsComponent,
            ],
            exports: [EventsComponent],
          })
export class EventsModule {
}
