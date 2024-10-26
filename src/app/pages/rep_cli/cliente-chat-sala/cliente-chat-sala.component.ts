import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-chat-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-chat-sala.component.html',
  styleUrl: './cliente-chat-sala.component.css'
})
export class ClienteChatSalaComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
