import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AttackResultsComponent} from './attack-results.component';

describe('AuditResultsComponent', () => {
  let component: AttackResultsComponent;
  let fixture: ComponentFixture<AttackResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [AttackResultsComponent],
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
