import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGestionCuentasComponent } from './admin-gestion-cuentas.component';

describe('AdminGestionCuentasComponent', () => {
  let component: AdminGestionCuentasComponent;
  let fixture: ComponentFixture<AdminGestionCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGestionCuentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminGestionCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
