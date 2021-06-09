import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DatalayerService} from '../../app/@core/services/finsec/data-layer/data-layer.service';
import {NbToastrService, NbWindowService} from '@nebular/theme';
import {ShowComponent} from './show/show.component';
import {ItemDetailService} from '../../app/@core/services/finsec/item-detail/item-detail.service';
import {MitigationService} from '../../app/@core/services/finsec/mitigation/mitigation.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerSourceConf} from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import CONFIG from '../../app/app.config';
import {HeadersServerDataSource} from './finsec.table.module';

@Component({
             selector: 'finsec-table',
             templateUrl: './finsec.table.component.html',
             styleUrls: ['./finsec.table.component.scss'],
           })
export class FinsecTableComponent implements OnInit, OnDestroy {
  @Input() type: string;
  @Input() fields: Array<string>;
  @Input() limit: any;
  @Input() actions: any;
  @Input() customCallback: any;
  @Input() class: any;
  @Input() extra_columns: any;
  source: HeadersServerDataSource;
  pagination_url = CONFIG.pagination_url;

  data = [];
  webSocket = null;

  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 9,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      created: {
        title: 'Created',
        type: 'string',
      },
      modified: {
        title: 'Modified',
        type: 'string',
      },
    },
  };

  constructor(private datalayerService: DatalayerService,
              private mitigationService: MitigationService,
              private windowService: NbWindowService,
              private http: HttpClient,
              private itemDetailService: ItemDetailService,
              private toast: NbToastrService) {

  }

  // TODO: modify the limit or apply pagination
  ngOnInit(): void {
    const headers = new HttpHeaders({
                                      'Accept': 'application/json',
                                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                      'X-organization': sessionStorage.getItem('x_organization'),
                                    });
    this.settings.columns = {...this.settings.columns, ...this.extra_columns};
    this.settings.actions = this.actions;
    let query = {};
    if (this.type === 'x-event') {
      const now = new Date();
      const pastDay = new Date(now.getTime() - (1000 * 60 * 60 * 24 * 30));
      query = {
        'datatype': 'Instance',
      };
    }

    this.webSocket = this.datalayerService.initDataStream(this.type, null, query);
    this.datalayerService.rootNodeStream(this.webSocket).subscribe(item => {
      this.toast.info(item.name);
      this.source.prepend(item);
    });

    const serverSettings = new ServerSourceConf(
      {
        endPoint: this.pagination_url + '/' + this.type,
        totalKey: 'total',
        dataKey: 'data',
        pagerPageKey: 'page',
        pagerLimitKey: 'limit',
      });
    // this.http.options({headers: headers});
    this.source = new HeadersServerDataSource(this.http, headers, serverSettings);

    // forkJoin(
    //   this.datalayerService.paginate('x-asset', this.limit),
    //   // this.datalayerService.rootNode(this.type, null, query, this.limit),
    //   this.datalayerService.count(this.type),
    // )
    //   .subscribe(([items, count]: [any[], number]) => {
    //     // this.data = items;
    //     // this.data.splice(-1, 1);
    //     // // count.splice(-1,1);
    //     // this.data['total'] = 100;
    //     //
    //     const serverSettings = new ServerSourceConf(
    //       {
    //         endPoint: this.datalayerService.retrieve_url,
    //         totalKey: 'total',
    //         dataKey: 'data',
    //         pagerPageKey: 'page',
    //         pagerLimitKey: 'limit',
    //       });
    //     this.source = new ServerDataSource(this.http, serverSettings);
    //   });
  }

  ngOnDestroy() {
    this.webSocket.close();
  }

  onRowSelect(event): void {
    this.itemDetailService.addItem(event);
    this.windowService.open(ShowComponent, {title: `Details`, context: {fields: this.fields}, windowClass: 'window-limited-height'});
  }

  onDeleteConfirm($event): void {
  }
}

