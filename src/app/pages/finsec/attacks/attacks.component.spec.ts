import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssetsComponent} from './attacks.component';

describe('VulnerabilitiesComponent', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [AssetsComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
