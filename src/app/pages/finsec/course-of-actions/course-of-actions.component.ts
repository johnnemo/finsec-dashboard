import {Component, OnInit} from '@angular/core';
import {ActionStatusComponent} from './action-status/action-status.component';
import {MitigationService} from '../../../@core/services/finsec/mitigation/mitigation.service';

@Component({
             selector: 'ngx-finsec-course-of-actions',
             templateUrl: './course-of-actions.component.html',
             styleUrls: ['./course-of-actions.component.scss'],
           })
export class CourseOfActionsComponent implements OnInit {
  fields = ['name', 'x_subtype', 'active', 'description', 'domain', 'x_actions'];
  class = 'order-table';
  extra_columns = {
    active: {
      title: 'Active',
      type: 'custom',
      renderComponent: ActionStatusComponent,
    },
  };

  actions = {
    add: false,
    edit: false,
    delete: false,
    position: 'right',
    custom: [
      {
        name: 'de-activate',
        title: '<i class="nb-close inline-block width: 50px"></i>',
      },
    ],
  };


  constructor(private mitigationService: MitigationService) {
  }

  ngOnInit(): void {
  }

  onCustomAction($event) {
    return this.mitigationService.activate($event.data.id).toPromise().then(data => {
      if (data.action.result === true) {
        $event.data.active = false;
        /*
        TODO: check the refresh functionality for the table changing here
        */
        // this.source.refresh();
      }
    });
  }

}
