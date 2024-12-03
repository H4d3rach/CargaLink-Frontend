import { TestBed } from '@angular/core/testing';

import { ChatBService } from './chat-b.service';

describe('ChatBService', () => {
  let service: ChatBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
