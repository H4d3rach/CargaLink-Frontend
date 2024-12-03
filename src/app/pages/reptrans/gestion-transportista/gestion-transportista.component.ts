import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { TransportistaService } from '../../../servicios/transportistas/transportista.service';
import { Router, RouterLink } from '@angular/router';
import { transportistaModelo } from '../../../servicios/transportistas/transportistaModelo';
import { FormsModule } from '@angular/forms';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-gestion-transportista',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gestion-transportista.component.html',
  styleUrl: './gestion-transportista.component.css'
})
export class GestionTransportistaComponent implements OnInit{
  private _login = inject(LoginService); //Inyeccion del servicio del login
  private _transportista = inject(TransportistaService); //Inyeccion del servicio de transportista
  private router = inject(Router); //Inyeccion del router
  isSidebarCollapsed: boolean = false; //Variables de control que ayudan a controlar los despliegues de vistas en el html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  transList: transportistaModelo[]= [];
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
    this._transportista.getAllTrans().subscribe((transData)=>{ //Obtencion de una lista de todos los transportistas registrados
      this.transList = transData; //Obtencion de la lista con el servicio de transportista
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
  preguntarChat(){
    this.historialMensajesChatbot.push({clase: 'usuario', msj: this.preguntaChat});
    this._chatbot.usarChatbot(this.preguntaChat).subscribe((respuesta)=>{
      this.historialMensajesChatbot.push({clase: 'bot', msj: respuesta.respuesta});
      localStorage.setItem('chatMensajes', JSON.stringify(this.historialMensajesChatbot));
    })
    this.preguntaChat=""
  }
  eliminarTrans(id: string){ //Metodo que elimina al transportista
    this._transportista.deleteTrans(id).subscribe({ //suscripcion al servicio de transportista
      next: () =>{
        console.log("Transportista eliminado");
        this.transList = this.transList.filter(trans => trans.idUsuario != id); //Se elimina el transportista de la lista local, para no mostrarla una vez que se elimina
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    })
  }
  editTrans(id : string){ //Metodo que nos redirige al componente de actualizar transportista
    this.router.navigate(['/rep_trans/transportistas/',id]);
  }
  formatText(text: string): string { //Metodo que ayuda a  darle formato a respuestas que lo requieran
    return text
      .toLowerCase()
      .replace(/_/g,' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
