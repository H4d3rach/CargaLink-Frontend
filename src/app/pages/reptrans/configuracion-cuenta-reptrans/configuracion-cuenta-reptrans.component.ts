import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracion-cuenta-reptrans',
  standalone: true,
  imports: [],
  templateUrl: './configuracion-cuenta-reptrans.component.html',
  styleUrl: './configuracion-cuenta-reptrans.component.css'
})
export class ConfiguracionCuentaReptransComponent {
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
