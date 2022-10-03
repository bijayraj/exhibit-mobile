import { TestBed } from '@angular/core/testing';

import { ExhibitService } from './exhibit.service';

describe('ExhibitService', () => {
  let service: ExhibitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExhibitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
