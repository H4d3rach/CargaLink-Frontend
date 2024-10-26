import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTransportistaComponent } from './reg-transportista.component';

describe('RegTransportistaComponent', () => {
  let component: RegTransportistaComponent;
  let fixture: ComponentFixture<RegTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegTransportistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
