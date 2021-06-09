import { TestBed } from '@angular/core/testing';

import { CollaborativeRiskService } from './collaborative-risk.service';

describe('CollaborativeRiskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollaborativeRiskService = TestBed.get(CollaborativeRiskService);
    expect(service).toBeTruthy();
  });
});
