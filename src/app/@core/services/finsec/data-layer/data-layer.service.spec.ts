import {TestBed} from '@angular/core/testing';

import {DatalayerService} from './data-layer.service';

describe('AnomalyDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatalayerService = TestBed.get(DatalayerService);
    expect(service).toBeTruthy();
  });
});
