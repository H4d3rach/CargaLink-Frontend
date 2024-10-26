import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransConfigComponent } from './trans-config.component';

describe('TransConfigComponent', () => {
  let component: TransConfigComponent;
  let fixture: ComponentFixture<TransConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
