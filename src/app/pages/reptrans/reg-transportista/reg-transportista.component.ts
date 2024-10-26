import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reg-transportista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg-transportista.component.html',
  styleUrl: './reg-transportista.component.css'
})
export class RegTransportistaComponent {
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
