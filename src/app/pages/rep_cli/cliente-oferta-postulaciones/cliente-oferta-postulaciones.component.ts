import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { modeloPostulcion } from '../../../servicios/postulaciones/modeloPostulacion';
import { FormsModule } from '@angular/forms';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-cliente-oferta-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cliente-oferta-postulaciones.component.html',
  styleUrl: './cliente-oferta-postulaciones.component.css'
})
export class ClienteOfertaPostulacionesComponent implements OnInit {
  
  private _login = inject(LoginService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  private route =  inject(ActivatedRoute);
  isSidebarCollapsed: boolean = false;
  isCardOpen: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  idOferta: number = 0;
  postulacionList: modeloPostulcion[] = [];
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(){ //Inyeccion del formBuilder
    this.idOferta = Number(this.route.snapshot.paramMap.get('idOferta')); //Obtencion de la placa del vehiculo por medio de la url
  }
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({ //Conexion al servicio del login para determinar si el usuario está loggeado
      next:(isUserLogged)=>{
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
    
    this._postulacion.viewAllPostulaciones(this.idOferta).subscribe({
      next: (postulacionData)=>{
        this.postulacionList = postulacionData;
      }
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
  aceptarPostulacion(postulacion: modeloPostulcion){
    this._postulacion.aceptarPostulacion(postulacion).subscribe({
      next: ()=>{
        console.log("Postulacion aceptaqda");
        this.router.navigateByUrl('cliente/gestion');
      }
    })
  }
  seeInfo(id: string){
    this.router.navigate(['/cliente/gestion/oferta/postulante/',id]);
  }
  toggleCard(){
    this.isCardOpen = !this.isCardOpen;
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  chat(id:string | undefined){
    this.router.navigate(['/cliente/chat/',id]);
  }
  logout(){ //Metodo que ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
