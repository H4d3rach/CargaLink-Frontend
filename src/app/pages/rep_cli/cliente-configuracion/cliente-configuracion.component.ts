import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-configuracion.component.html',
  styleUrl: './cliente-configuracion.component.css'
})
export class ClienteConfiguracionComponent {
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  transferirCuenta: boolean = false;
  cambiarPassword: boolean = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  toggleCuenta(){
    this.transferirCuenta = !this.transferirCuenta;
    this.cambiarPassword = false;
  }
  togglePassword(){
    this.cambiarPassword = !this.cambiarPassword;
    this.transferirCuenta = false;
  }
  togglePrincipal(){
    this.cambiarPassword = false;
    this.transferirCuenta = false;
  }
}
