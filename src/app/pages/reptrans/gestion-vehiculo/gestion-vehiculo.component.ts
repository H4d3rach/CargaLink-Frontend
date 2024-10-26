import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-vehiculo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-vehiculo.component.html',
  styleUrl: './gestion-vehiculo.component.css'
})
export class GestionVehiculoComponent {
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
