import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TtpsComponent} from './ttps.component';

describe('ProbesComponent', () => {
  let component: TtpsComponent;
  let fixture: ComponentFixture<TtpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [TtpsComponent],
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
