import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-finsec',
             templateUrl: './regulations.component.html',
             styleUrls: ['./regulations.component.scss'],
           })
export class RegulationsComponent implements OnInit {
  regulation: any;
  message: any;
  selectedItem = '0';
  fields = ['name', 'subtype', 'description', 'coordinates', 'observable_url', 'domain', 'ipv4_addr'];

  ngOnInit(): void {

  }

  getRegulation($event) {
    this.regulation = $event;
  }

  getMessage($event) {
    this.message = $event;
  }

}
