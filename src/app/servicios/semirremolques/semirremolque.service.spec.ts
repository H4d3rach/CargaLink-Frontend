import { TestBed } from '@angular/core/testing';

import { SemirremolqueService } from './semirremolque.service';

describe('SemirremolqueService', () => {
  let service: SemirremolqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemirremolqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
