import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-sala.component.html',
  styleUrl: './chat-sala.component.css'
})
export class ChatSalaComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
