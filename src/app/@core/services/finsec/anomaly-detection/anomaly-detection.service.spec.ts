import {TestBed} from '@angular/core/testing';

import {AnomalyDetectionService} from './anomaly-detection.service';

describe('AnomalyDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnomalyDetectionService = TestBed.get(AnomalyDetectionService);
    expect(service).toBeTruthy();
  });
});
