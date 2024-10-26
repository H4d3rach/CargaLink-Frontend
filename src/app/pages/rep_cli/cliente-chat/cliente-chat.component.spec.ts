import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteChatComponent } from './cliente-chat.component';

describe('ClienteChatComponent', () => {
  let component: ClienteChatComponent;
  let fixture: ComponentFixture<ClienteChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
