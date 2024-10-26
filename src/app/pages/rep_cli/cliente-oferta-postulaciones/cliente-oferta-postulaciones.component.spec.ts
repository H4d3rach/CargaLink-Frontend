import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteOfertaPostulacionesComponent } from './cliente-oferta-postulaciones.component';

describe('ClienteOfertaPostulacionesComponent', () => {
  let component: ClienteOfertaPostulacionesComponent;
  let fixture: ComponentFixture<ClienteOfertaPostulacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteOfertaPostulacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteOfertaPostulacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
