import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FinsecDualListCustomComponent} from './finsec-dual-list-custom.component';

describe('FinsecDualListCustomComponent', () => {
  let component: FinsecDualListCustomComponent;
  let fixture: ComponentFixture<FinsecDualListCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [FinsecDualListCustomComponent],
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinsecDualListCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
