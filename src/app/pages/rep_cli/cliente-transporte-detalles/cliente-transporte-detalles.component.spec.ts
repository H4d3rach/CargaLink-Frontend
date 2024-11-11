import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTransporteDetallesComponent } from './cliente-transporte-detalles.component';

describe('ClienteTransporteDetallesComponent', () => {
  let component: ClienteTransporteDetallesComponent;
  let fixture: ComponentFixture<ClienteTransporteDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTransporteDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteTransporteDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
