import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTransportistaComponent } from './gestion-transportista.component';

describe('GestionTransportistaComponent', () => {
  let component: GestionTransportistaComponent;
  let fixture: ComponentFixture<GestionTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTransportistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
