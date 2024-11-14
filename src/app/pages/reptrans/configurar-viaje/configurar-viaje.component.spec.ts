import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarViajeComponent } from './configurar-viaje.component';

describe('ConfigurarViajeComponent', () => {
  let component: ConfigurarViajeComponent;
  let fixture: ComponentFixture<ConfigurarViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarViajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurarViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
