import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'rc',
  templateUrl: './rec.component.html',
  styleUrls: ['./rec.component.scss'],
})
export class RecComponent implements OnInit {

  @Input() item: any;
  constructor() { }

  ngOnInit() {
  }

}
