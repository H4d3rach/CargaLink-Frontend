import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdSemiComponent } from './upd-semi.component';

describe('UpdSemiComponent', () => {
  let component: UpdSemiComponent;
  let fixture: ComponentFixture<UpdSemiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdSemiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdSemiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
