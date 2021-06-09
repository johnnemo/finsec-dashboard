import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {AuditService} from '../../../@core/services/finsec/audit/audit.service';
import {ChangeTabService} from './ref/changeTab.service';

@Component({
             selector: 'ngx-finsec-audit',
             templateUrl: './compliance.component.html',
             styleUrls: ['./compliance.component.scss'],
           })
export class ComplianceComponent implements OnInit, AfterViewInit {

  themeSubscription: any;
  source = [];
  report = null;
  selectedIndex = 0;
  displayedRolesColumns: string[] = ['role', 'description'];
  displayedIdentitiesColumns = [
    'x_user',
    'name',
    'contact_information',
    'labels',
    'description',
  ];
  displayedLevelsColumns = ['level', 'description'];
  displayedClaimsColumns = ['claim', 'compliant', 'description'];
  displayedLogColumns = ['entry_type', 'date', 'x_user', 'comment'];
  compliance_reports: any[] = [];
  compliance_report: any;
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      id: {
        title: 'Identifier',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      created: {
        title: 'Created',
        type: 'string',
      },
    },
  };

  constructor(
    private auditService: AuditService,
    private theme: NbThemeService,
    private changeTabService: ChangeTabService,
  ) {
    this.changeTabService.subj$.subscribe((result: number) => {
      this.selectedIndex = result;
    });
  }

  ngOnInit(): void {
    this.auditService.reports(sessionStorage.getItem('x_organization')).subscribe(models => {
      this.source = models;
    });
  }

  onRowSelect(event) {
    this.selectedIndex = 0;
    this.auditService.reportDetails(event.data.id).subscribe(result => this.report = result);
  }

  ngAfterViewInit() {

  }

  navigateToTab(tab, $event) {
    $event.preventDefault();
    this.selectedIndex = tab;
  }

  get code() {
    return JSON.stringify(this.compliance_report, null, 2);
  }

  set code(v) {
    try {
      this.compliance_report = JSON.parse(v);
    } catch (e) {
    }
  }

}

