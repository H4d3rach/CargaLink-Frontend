import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { modeloVehiculo } from '../../../servicios/vehiculos/modeloVehiculo';
import { VehiculoService } from '../../../servicios/vehiculos/vehiculo.service';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-vehiculo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gestion-vehiculo.component.html',
  styleUrl: './gestion-vehiculo.component.css'
})
export class GestionVehiculoComponent implements OnInit {
 
  private _login = inject(LoginService); //Inyeccion del servicio de login
  private _vehiculo = inject(VehiculoService); //Inyeccion del servicio de vehiculo
  private router = inject(Router); //Inyeccion del router
  isSidebarCollapsed: boolean = false; //Variables de control para manejar distintas partes del html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  vehiculosList: modeloVehiculo[] = [];
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({ //Esta suscripción a el servicio login nos ayudará a detectar que el usuario esté logueado
      next:(isUserLogged)=>{              //Si no es así se dirige a la ventana de login
        this.isUserLogged =isUserLogged;
      },
      error: (errorData) =>{
        console.log(errorData);
      },
      complete: () => {
        if(this.isUserLogged == false){
          this.router.navigateByUrl('login');
        }
      }
    });
    this._vehiculo.getAllVehiculos().subscribe((vehiculoData)=>{ //Obtencion de una lista de todos los vehiculos registrados
      this.vehiculosList = vehiculoData;
    })
    const historial = localStorage.getItem('chatMensajes');
  if(historial){
    this.historialMensajesChatbot = JSON.parse(historial);
  }
  const chatOpenGuardado = localStorage.getItem('chatOpen'); 
  if(chatOpenGuardado){
    this.chatOpen = chatOpenGuardado === 'true';
  }
  }
  formatText(text: string): string { //Metodo que ayuda a  darle formato a respuestas que lo requieran
    return text
      .toLowerCase()
      .replace(/_/g,' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  deleteVehiculo(placa: string){ //Metodo que ayuda a eliminar el vehiculo
    this._vehiculo.deleteVehiculo(placa).subscribe({
      next: () =>{
        console.log("Vehiculo eliminado");
        this.vehiculosList = this.vehiculosList.filter(vehiculo => vehiculo.placa != placa); //Se elimina el vehiculo de la lista local, para no mostrarla una vez que se elimina
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    })
  }
  preguntarChat(){
    this.historialMensajesChatbot.push({clase: 'usuario', msj: this.preguntaChat});
    this._chatbot.usarChatbot(this.preguntaChat).subscribe((respuesta)=>{
      this.historialMensajesChatbot.push({clase: 'bot', msj: respuesta.respuesta});
      localStorage.setItem('chatMensajes', JSON.stringify(this.historialMensajesChatbot));
    })
    this.preguntaChat=""
  }
  editarVehiculo(placa: string){ //Metodo que redirige al componente para editar el vehiculo
    this.router.navigate(['/rep_trans/vehiculos',placa]);
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  logout(){ //Funcion para cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
