import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditResultsComponent} from './audit-results.component';

describe('AuditResultsComponent', () => {
  let component: AuditResultsComponent;
  let fixture: ComponentFixture<AuditResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [AuditResultsComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
