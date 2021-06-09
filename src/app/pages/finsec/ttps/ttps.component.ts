import {Component, OnInit} from '@angular/core';
import {NbDialogRef, NbWindowService} from "@nebular/theme";
import {BlockchainService} from "../../../@core/services/finsec/blockchain/blockchain.service";
import {ShowComponent} from "../../../../components/table/show/show.component";
import {ItemDetailService} from "../../../@core/services/finsec/item-detail/item-detail.service";

@Component({
             selector: 'ngx-finsec',
             templateUrl: './ttps.component.html',
             styleUrls: ['./ttps.component.scss'],
           })
export class TtpsComponent implements OnInit {
  value: any;
  ttp: any;
  message: any;
  selectedItem = '0';
  fields = ['name', 'subtype', 'description', 'coordinates', 'observable_url', 'domain', 'ipv4_addr'];
  class = 'order-table';

  constructor(private windowService: NbWindowService,
              private blockchainService: BlockchainService,
              private itemDetailService: ItemDetailService
  ) {
  }

  ngOnInit(): void {

  }

  getTtp($event) {
    this.ttp = $event;
  }

  getMessage($event) {
    this.message = $event;
  }

  onCustomAction($event) {
    this.itemDetailService.addItem($event);
    this.windowService.open(ShowComponent, {title: `Details`, context: {fields: this.fields}});
  }

}
