import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdRecursosComponent } from './upd-recursos.component';

describe('UpdRecursosComponent', () => {
  let component: UpdRecursosComponent;
  let fixture: ComponentFixture<UpdRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdRecursosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
