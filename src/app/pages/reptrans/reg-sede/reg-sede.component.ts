import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reg-sede',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg-sede.component.html',
  styleUrl: './reg-sede.component.css'
})
export class RegSedeComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
