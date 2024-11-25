import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrellasCalificacionComponent } from './estrellas-calificacion.component';

describe('EstrellasCalificacionComponent', () => {
  let component: EstrellasCalificacionComponent;
  let fixture: ComponentFixture<EstrellasCalificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstrellasCalificacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstrellasCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
