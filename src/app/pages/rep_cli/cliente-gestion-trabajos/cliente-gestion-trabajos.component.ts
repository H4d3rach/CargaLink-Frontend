import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-gestion-trabajos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-gestion-trabajos.component.html',
  styleUrl: './cliente-gestion-trabajos.component.css'
})
export class ClienteGestionTrabajosComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
