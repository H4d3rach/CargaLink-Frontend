import { TestBed } from '@angular/core/testing';

import { RegistroTransporteService } from './registro-transporte.service';

describe('RegistroTransporteService', () => {
  let service: RegistroTransporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroTransporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
