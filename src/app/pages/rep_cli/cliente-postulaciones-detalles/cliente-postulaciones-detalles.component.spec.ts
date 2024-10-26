import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePostulacionesDetallesComponent } from './cliente-postulaciones-detalles.component';

describe('ClientePostulacionesDetallesComponent', () => {
  let component: ClientePostulacionesDetallesComponent;
  let fixture: ComponentFixture<ClientePostulacionesDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientePostulacionesDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientePostulacionesDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
