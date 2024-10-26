import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransChatSalaComponent } from './trans-chat-sala.component';

describe('TransChatSalaComponent', () => {
  let component: TransChatSalaComponent;
  let fixture: ComponentFixture<TransChatSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransChatSalaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransChatSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
