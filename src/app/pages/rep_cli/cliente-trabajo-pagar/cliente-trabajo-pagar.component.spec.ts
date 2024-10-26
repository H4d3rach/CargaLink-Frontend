import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTrabajoPagarComponent } from './cliente-trabajo-pagar.component';

describe('ClienteTrabajoPagarComponent', () => {
  let component: ClienteTrabajoPagarComponent;
  let fixture: ComponentFixture<ClienteTrabajoPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTrabajoPagarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteTrabajoPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
