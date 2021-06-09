import {NgModule} from '@angular/core';
import {FinsecModule} from '../finsec.module';
import {CourseOfActionsComponent} from './course-of-actions.component';
import {ActionStatusComponent} from './action-status/action-status.component';
import {ActionStatusModule} from './action-status/action-status.module';

@NgModule({
            imports: [
              FinsecModule,
              ActionStatusModule,
            ],
            declarations: [
              CourseOfActionsComponent,
            ],
            exports: [CourseOfActionsComponent],
            entryComponents: [ActionStatusComponent],
          })
export class CourseOfActionsModule {
}
