import {Component, OnInit} from '@angular/core';

@Component({
             selector: 'ngx-finsec',
             templateUrl: './organizations.component.html',
             styleUrls: ['./organizations.component.scss'],
           })
export class OrganizationsComponent implements OnInit {
  selectedItem = '0';
  organization: any;
  message: any;
  fields = [
    'name',
    'description',
    'address',
    'city',
    'company_profile',
  ];

  ngOnInit(): void {

  }

  getOrganization($event) {
    this.organization = $event;
  }

  getMessage($event) {
    this.message = $event;
  }
}
