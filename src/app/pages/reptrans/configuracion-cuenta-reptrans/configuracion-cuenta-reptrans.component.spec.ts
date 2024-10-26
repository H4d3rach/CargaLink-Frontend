import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCuentaReptransComponent } from './configuracion-cuenta-reptrans.component';

describe('ConfiguracionCuentaReptransComponent', () => {
  let component: ConfiguracionCuentaReptransComponent;
  let fixture: ComponentFixture<ConfiguracionCuentaReptransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionCuentaReptransComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionCuentaReptransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
