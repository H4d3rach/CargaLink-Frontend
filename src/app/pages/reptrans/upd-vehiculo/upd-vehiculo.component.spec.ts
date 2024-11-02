import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdVehiculoComponent } from './upd-vehiculo.component';

describe('UpdVehiculoComponent', () => {
  let component: UpdVehiculoComponent;
  let fixture: ComponentFixture<UpdVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdVehiculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
