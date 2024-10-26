import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTrabajosComponent } from './gestion-trabajos.component';

describe('GestionTrabajosComponent', () => {
  let component: GestionTrabajosComponent;
  let fixture: ComponentFixture<GestionTrabajosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTrabajosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionTrabajosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
