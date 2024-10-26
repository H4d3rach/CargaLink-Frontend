import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-transportista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-transportista.component.html',
  styleUrl: './gestion-transportista.component.css'
})
export class GestionTransportistaComponent {
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
