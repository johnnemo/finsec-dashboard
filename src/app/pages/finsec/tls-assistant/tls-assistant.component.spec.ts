import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TlsAssistantComponent} from './tls-assistant.component';

describe('PredictiveAnalyticsComponent', () => {
  let component: TlsAssistantComponent;
  let fixture: ComponentFixture<TlsAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [TlsAssistantComponent],
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlsAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
