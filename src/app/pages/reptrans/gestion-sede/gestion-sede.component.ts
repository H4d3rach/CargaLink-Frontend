import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-sede',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-sede.component.html',
  styleUrl: './gestion-sede.component.css'
})
export class GestionSedeComponent {
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
