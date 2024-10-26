import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETransporteRegistroComponent } from './e-transporte-registro.component';

describe('ETransporteRegistroComponent', () => {
  let component: ETransporteRegistroComponent;
  let fixture: ComponentFixture<ETransporteRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ETransporteRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ETransporteRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
