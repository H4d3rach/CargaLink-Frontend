import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSemirremolqueComponent } from './gestion-semirremolque.component';

describe('GestionSemirremolqueComponent', () => {
  let component: GestionSemirremolqueComponent;
  let fixture: ComponentFixture<GestionSemirremolqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSemirremolqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionSemirremolqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
