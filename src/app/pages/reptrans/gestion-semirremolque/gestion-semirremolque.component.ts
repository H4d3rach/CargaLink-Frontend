import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { modeloSemirremolque } from '../../../servicios/semirremolques/modeloSemirremolque';
import { SemirremolqueService } from '../../../servicios/semirremolques/semirremolque.service';
import { FormsModule } from '@angular/forms';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-gestion-semirremolque',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gestion-semirremolque.component.html',
  styleUrl: './gestion-semirremolque.component.css'
})
export class GestionSemirremolqueComponent implements OnInit {
  private _login = inject(LoginService); //Inyeccion del servicio de login
  private router = inject(Router); //inyeccion del router
  private _semirremolque = inject(SemirremolqueService); //Inyeccion del servicio de semirremolque
  isSidebarCollapsed: boolean = false; //Variables de control que nos ayudarán a desplegar elementos en el html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  semirremolqueList: modeloSemirremolque[]= [];
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
    this._semirremolque.getAllSemirremolque().subscribe((semiData)=>{ //Obtencion de una lista de todos los semirremolques registrados
      this.semirremolqueList = semiData;
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

  formatText(text: string): string { //Metodo que ayuda a  darle formato a respuestas que lo requieran
    return text
      .toLowerCase()
      .replace(/_/g,' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  deleteSemi(id:number){ //Conecion con el servicio para eliminar un semirremolque
    this._semirremolque.delSemi(id).subscribe({
      next: () =>{
        console.log("Semirremolque eliminado");
        this.semirremolqueList = this.semirremolqueList.filter(semi => semi.idSemirremolque != id); //Se elimina el semirremolque de la lista local, para no mostrarla una vez que se elimina
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    })
  }

  actualizarSemi(id: number){ //Metodo que nos dirige al componente de actualizacion de semirremolque
    this.router.navigate(['/rep_trans/semirremolques/',id]);
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
