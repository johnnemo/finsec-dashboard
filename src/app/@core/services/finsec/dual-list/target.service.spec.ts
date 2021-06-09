import {TestBed} from '@angular/core/testing';

import {TargetService} from './target.service';

describe('ItemDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetService = TestBed.get(TargetService);
    expect(service).toBeTruthy();
  });
});
