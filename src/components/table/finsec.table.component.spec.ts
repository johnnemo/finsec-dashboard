import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FinsecTableComponent} from './finsec.table.component';

describe('FinsecTableComponent', () => {
  let component: FinsecTableComponent;
  let fixture: ComponentFixture<FinsecTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [FinsecTableComponent],
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinsecTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
