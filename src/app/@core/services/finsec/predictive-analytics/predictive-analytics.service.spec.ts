import {TestBed} from '@angular/core/testing';

import {PredictiveAnalyticsService} from './predictive-analytics.service';

describe('AnomalyDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PredictiveAnalyticsService = TestBed.get(PredictiveAnalyticsService);
    expect(service).toBeTruthy();
  });
});
