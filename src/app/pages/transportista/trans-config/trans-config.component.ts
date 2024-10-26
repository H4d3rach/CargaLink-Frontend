import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-trans-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trans-config.component.html',
  styleUrl: './trans-config.component.css'
})
export class TransConfigComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  cambiarPassword: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  togglePassword(){
    this.cambiarPassword = !this.cambiarPassword;
  }
  togglePrincipal(){
    this.cambiarPassword = false;
  }
}
