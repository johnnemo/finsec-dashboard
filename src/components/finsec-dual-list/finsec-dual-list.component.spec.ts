import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FinsecDualListComponent} from './finsec-dual-list.component';

describe('FinsecDualListComponent', () => {
  let component: FinsecDualListComponent;
  let fixture: ComponentFixture<FinsecDualListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [FinsecDualListComponent],
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinsecDualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
