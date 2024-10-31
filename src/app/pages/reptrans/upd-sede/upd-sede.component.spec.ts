import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdSedeComponent } from './upd-sede.component';

describe('UpdSedeComponent', () => {
  let component: UpdSedeComponent;
  let fixture: ComponentFixture<UpdSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdSedeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
