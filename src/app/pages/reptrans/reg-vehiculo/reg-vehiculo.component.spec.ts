import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegVehiculoComponent } from './reg-vehiculo.component';

describe('RegVehiculoComponent', () => {
  let component: RegVehiculoComponent;
  let fixture: ComponentFixture<RegVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegVehiculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
