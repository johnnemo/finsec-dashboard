import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-finsec-asset',
             templateUrl: './assets.component.html',
             styleUrls: ['./assets.component.scss'],
           })
export class AssetsComponent implements OnInit {
  asset: any;
  message: any;
  fields = [
    'name',
    'description',
    'coordinates',
    'product_name',
    'product_version',
    'product_vendor',
    'domain',
    'domain_name',
    'ipv4_addr',
  ];

  getAsset($event) {
    this.asset = $event;
  }

  getMessage($event) {
    this.message = $event;
  }

  ngOnInit(): void {

  }

}
