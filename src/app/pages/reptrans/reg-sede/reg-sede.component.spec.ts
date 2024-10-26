import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSedeComponent } from './reg-sede.component';

describe('RegSedeComponent', () => {
  let component: RegSedeComponent;
  let fixture: ComponentFixture<RegSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegSedeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
