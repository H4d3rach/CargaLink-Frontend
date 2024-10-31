import { TestBed } from '@angular/core/testing';

import { InterceptorErrorService } from './interceptor-error.service';

describe('InterceptorErrorService', () => {
  let service: InterceptorErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptorErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
