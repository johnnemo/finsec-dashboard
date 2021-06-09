import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProbesComponent} from './probes.component';

describe('ProbesComponent', () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [ProbesComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
