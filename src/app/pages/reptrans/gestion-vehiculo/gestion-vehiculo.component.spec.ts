import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVehiculoComponent } from './gestion-vehiculo.component';

describe('GestionVehiculoComponent', () => {
  let component: GestionVehiculoComponent;
  let fixture: ComponentFixture<GestionVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionVehiculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
