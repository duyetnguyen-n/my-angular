import { TestBed } from '@angular/core/testing';

import { LinkedService } from './linked.service';

describe('LinkedService', () => {
  let service: LinkedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
