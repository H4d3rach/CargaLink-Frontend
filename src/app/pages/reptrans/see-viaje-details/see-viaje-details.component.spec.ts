import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeViajeDetailsComponent } from './see-viaje-details.component';

describe('SeeViajeDetailsComponent', () => {
  let component: SeeViajeDetailsComponent;
  let fixture: ComponentFixture<SeeViajeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeViajeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeViajeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
