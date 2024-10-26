import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteChatSalaComponent } from './cliente-chat-sala.component';

describe('ClienteChatSalaComponent', () => {
  let component: ClienteChatSalaComponent;
  let fixture: ComponentFixture<ClienteChatSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteChatSalaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteChatSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
