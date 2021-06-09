import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService, NbToastrService, NbWindowService} from '@nebular/theme';
import {BlockchainService} from '../../../@core/services/finsec/blockchain/blockchain.service';
import {ShowComponent} from "../../../../components/table/show/show.component";
import {ItemDetailService} from "../../../@core/services/finsec/item-detail/item-detail.service";
import {interval, Subject} from "rxjs";
import {LocalDataSource} from "ng2-smart-table";
import {startWith, takeUntil} from "rxjs/operators";

@Component({
             selector: 'ngx-transactions',
             templateUrl: './transactions.component.html',
             styleUrls: ['./transactions.component.scss'],
           })
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {

  themeSubscription: any;
  private onDestroy$ = new Subject<void>();

  fields = [
    "id",
    "type",
    "subtype",
    "name",
    "description",
    "datatype",
    "domain",
    "notification_type",
    "country",
    "city",
    "postal",
    "regulation_date",
    "incident_insurance",
    "detection_date",
    "breach_date",
    "end_date",
    "breach_cause",
    "adverse_effects_measures",
    "incident_mitigation_measures",
    "personal_data_encryption",
    "attack_cause",
    "attack_motivation",
    "malicious_software",
    "impact",
    "datasets_affected",
    "notified",
    "notified_counter",
    "notification_cost",
    "financial_damage",
    "dpia"
  ];


  source = [];
  dataSource: LocalDataSource;
  transactions = [];
  refMap = new Map();
  assetRefMap = new Map();
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      transactionid: {
        title: 'Transaction Id',
        type: 'string',
      },
      from: {
        title: 'From',
        type: 'string',
      },
      to: {
        title: 'To',
        type: 'string',
      },
      date: {
        title: 'Created',
        type: 'string',
      },
    },
  };

  constructor(
    private blockchainService: BlockchainService,
    private toastService: NbToastrService,
    private itemDetailService: ItemDetailService,
    private windowService: NbWindowService,
    private theme: NbThemeService,
  ) {
  }

  ngOnInit(): void {
    let newTransactions = [];
    let transactionCounter = 0;
    interval(10000).pipe(takeUntil(this.onDestroy$)).pipe(startWith(0)).subscribe(x => {
      this.blockchainService.all().toPromise().then(result => {
        if (this.source.length > 0) {
          result.forEach(transaction => {
            const latest = new Date(this.source[0].date);
            // Because backend responds with created order
            if ((new Date(transaction.date)).getTime() > latest.getTime()) {
              transactionCounter++;
              newTransactions.push(transaction);
            }
          });
        } else {
          newTransactions = result;
        }
        if (newTransactions.length > 0) {
          if (this.source.length > 0) {
            this.toastService.info(
              transactionCounter +
              ((transactionCounter > 1) ? ' Transactions' : ' Transaction') +
              'from stakeholders');
          }
          this.source = [...newTransactions, ...this.source];
          this.dataSource = new LocalDataSource(this.source);
          this.dataSource.refresh();
        }
      });
      transactionCounter = 0;
      newTransactions = [];
    });
  }


  //   Observable.interval(result => {});
  //   this.blockchainService.all().toPromise().then(result => {
  //     //TODO: all results should be visible
  //     result.forEach(transaction => {
  //       transactions.push(transaction);
  //     });
  //     this.source = transactions;
  //   });
  // }

  onRowSelect(event) {
    this.itemDetailService.addItem({'data': event.data.content});
    this.windowService.open(ShowComponent,
                            {title: `Details`, windowClass: 'window-limited-height', context: {fields: this.fields}});
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}

