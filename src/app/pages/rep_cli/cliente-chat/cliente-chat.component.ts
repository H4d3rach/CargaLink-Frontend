import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-chat.component.html',
  styleUrl: './cliente-chat.component.css'
})
export class ClienteChatComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
