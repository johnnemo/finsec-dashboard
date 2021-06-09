import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-finsec-event',
             templateUrl: './events.component.html',
             styleUrls: ['./events.component.scss'],
           })
export class EventsComponent implements OnInit {
  selectedItem = '0';
  fields = ['name', 'subtype', 'description', 'coordinates', 'domain', 'details'];

  ngOnInit(): void {

  }
}
