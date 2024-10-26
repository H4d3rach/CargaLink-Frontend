import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSemirremolqueComponent } from './reg-semirremolque.component';

describe('RegSemirremolqueComponent', () => {
  let component: RegSemirremolqueComponent;
  let fixture: ComponentFixture<RegSemirremolqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegSemirremolqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegSemirremolqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
