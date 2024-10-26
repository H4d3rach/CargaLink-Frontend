import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EClienteRegistroComponent } from './e-cliente-registro.component';

describe('EClienteRegistroComponent', () => {
  let component: EClienteRegistroComponent;
  let fixture: ComponentFixture<EClienteRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EClienteRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EClienteRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
