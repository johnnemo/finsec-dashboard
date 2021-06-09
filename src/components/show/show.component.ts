import {Component, OnInit} from '@angular/core';
import {DatalayerService} from '../../app/@core/services/finsec/data-layer/data-layer.service';
import {ActivatedRoute} from '@angular/router';

@Component({
             selector: 'ngx-show',
             templateUrl: './show.component.html',
             styleUrls: ['./show.component.scss'],
           })
export class ShowComponent implements OnInit {
  id: string;
  item: any;
  fields = {
    'x-area': [],
    'x-asset': [],
    'x-probe': [],
    'x-organization': [],
    'x-risk': [],
    'vulnerability': [],
    'course-of-action': [],
    'x-service': [],
    'x-threat': [],

  };

  constructor(private route: ActivatedRoute, private datalayerService: DatalayerService) {
    this.route.url.toPromise().then(params => {
      this.datalayerService.ids(params[0].path).toPromise().then(item => {
        this.item = item;
      });
    });
  }

  ngOnInit(): void {
  }

}
