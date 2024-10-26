import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeWorkDetailsComponent } from './see-work-details.component';

describe('SeeWorkDetailsComponent', () => {
  let component: SeeWorkDetailsComponent;
  let fixture: ComponentFixture<SeeWorkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeWorkDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeWorkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
