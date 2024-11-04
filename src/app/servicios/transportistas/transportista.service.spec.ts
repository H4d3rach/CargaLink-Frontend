import { TestBed } from '@angular/core/testing';

import { TransportistaService } from './transportista.service';

describe('TransportistaService', () => {
  let service: TransportistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
