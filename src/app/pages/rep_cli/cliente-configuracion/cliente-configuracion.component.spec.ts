import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteConfiguracionComponent } from './cliente-configuracion.component';

describe('ClienteConfiguracionComponent', () => {
  let component: ClienteConfiguracionComponent;
  let fixture: ComponentFixture<ClienteConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteConfiguracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
