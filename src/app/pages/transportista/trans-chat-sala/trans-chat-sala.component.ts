import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-trans-chat-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trans-chat-sala.component.html',
  styleUrl: './trans-chat-sala.component.css'
})
export class TransChatSalaComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
