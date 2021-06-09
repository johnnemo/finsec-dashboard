import {TestBed} from '@angular/core/testing';

import {RiskAssessmnentService} from './risk-assessmnent.service';

describe('RiskAssessmnentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiskAssessmnentService = TestBed.get(RiskAssessmnentService);
    expect(service).toBeTruthy();
  });
});
