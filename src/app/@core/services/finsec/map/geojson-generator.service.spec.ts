import {TestBed} from '@angular/core/testing';

import {GeojsonGeneratorService} from './geojson-generator.service';

describe('GeojsonGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeojsonGeneratorService = TestBed.get(GeojsonGeneratorService);
    expect(service).toBeTruthy();
  });
});
