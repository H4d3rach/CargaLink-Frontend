import { TestBed } from '@angular/core/testing';

import { PostulacionService } from './postulacion.service';

describe('PostulacionService', () => {
  let service: PostulacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostulacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
