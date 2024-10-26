import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteOfertaDetallesComponent } from './cliente-oferta-detalles.component';

describe('ClienteOfertaDetallesComponent', () => {
  let component: ClienteOfertaDetallesComponent;
  let fixture: ComponentFixture<ClienteOfertaDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteOfertaDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteOfertaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
