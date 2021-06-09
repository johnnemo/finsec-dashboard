import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItemDetailService} from '../../../app/@core/services/finsec/item-detail/item-detail.service';
import {Subscription} from 'rxjs/Subscription';
import {BlockchainService} from "../../../app/@core/services/finsec/blockchain/blockchain.service";
import {DatalayerService} from "../../../app/@core/services/finsec/data-layer/data-layer.service";
import {NbToastrService, NbWindowRef} from "@nebular/theme";

@Component({
             selector: 'ngx-show',
             templateUrl: './show.component.html',
             styleUrls: ['./show.component.scss'],
           })
export class ShowComponent implements OnInit, OnDestroy {
  item: any;
  // TODO: change it to come from the object so it can be more generic
  @Input() fields: Array<any>;
  private itemSubscription: Subscription;
  blockchain_objects = ['x-risk', 'x-regulation', 'malware'];
  blockchain_object = false;

  constructor(private itemDetailService: ItemDetailService,
              private blockchainService: BlockchainService,
              private datalayerService: DatalayerService,
              private toastrService: NbToastrService,
              protected windowRef: NbWindowRef,
  ) {
  }

  ngOnInit(): void {
    this.itemSubscription = this.itemDetailService.itemDetailed$.subscribe(item => {
      this.item = item['data'];
      if (this.blockchain_objects.includes(this.item.type)) {
        this.blockchain_object = true;
      }
    });
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }

  share() {

    this.blockchainService.create({'content': this.item, 'from': sessionStorage.getItem('x-organization'), 'date': new Date().toISOString() }).toPromise().then(result => {
      if (!result['errors']) {
        this.toastrService.success('Object shared successfully');
      } else {
        this.toastrService.danger('Error occured. The object could not be shared. Please try again');
      }
      this.windowRef.close();

    });
  }

}
