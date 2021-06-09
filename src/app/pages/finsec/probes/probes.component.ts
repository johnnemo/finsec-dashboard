import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-finsec',
             templateUrl: './probes.component.html',
             styleUrls: ['./probes.component.scss'],
           })
export class ProbesComponent implements OnInit {
  selectedItem = '0';
  probe: any;
  message: any;
  fields = ['name', 'subtype', 'description', 'coordinates', 'observable_url', 'domain', 'ipv4_addr'];

  ngOnInit(): void {

  }

  getProbe($event) {
    this.probe = $event;
  }

  getMessage($event) {
    this.message = $event;
  }
}
