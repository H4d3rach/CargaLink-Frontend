import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTrabajoDetallesComponent } from './cliente-trabajo-detalles.component';

describe('ClienteTrabajoDetallesComponent', () => {
  let component: ClienteTrabajoDetallesComponent;
  let fixture: ComponentFixture<ClienteTrabajoDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTrabajoDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteTrabajoDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
