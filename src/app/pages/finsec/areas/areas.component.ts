import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-finsec-area',
             templateUrl: './areas.component.html',
             styleUrls: ['./areas.component.scss'],
           })
export class AreasComponent implements OnInit {
  selectedItem = '0';
  area: any;
  message: any;

  fields = ['name', 'description', 'coordinates', 'domain'];


  ngOnInit(): void {

  }

  getArea($event) {
    this.area = $event;
  }

  getMessage($event) {
    this.message = $event;
  }
}
