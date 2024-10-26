import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteGestionTrabajosComponent } from './cliente-gestion-trabajos.component';

describe('ClienteGestionTrabajosComponent', () => {
  let component: ClienteGestionTrabajosComponent;
  let fixture: ComponentFixture<ClienteGestionTrabajosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteGestionTrabajosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteGestionTrabajosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
