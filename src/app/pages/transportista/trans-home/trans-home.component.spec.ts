import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransHomeComponent } from './trans-home.component';

describe('TransHomeComponent', () => {
  let component: TransHomeComponent;
  let fixture: ComponentFixture<TransHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
