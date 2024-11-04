import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdTransportistaComponent } from './upd-transportista.component';

describe('UpdTransportistaComponent', () => {
  let component: UpdTransportistaComponent;
  let fixture: ComponentFixture<UpdTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdTransportistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
