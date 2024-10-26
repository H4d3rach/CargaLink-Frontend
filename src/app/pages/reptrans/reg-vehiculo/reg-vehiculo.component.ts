import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reg-vehiculo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg-vehiculo.component.html',
  styleUrl: './reg-vehiculo.component.css'
})
export class RegVehiculoComponent {
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
