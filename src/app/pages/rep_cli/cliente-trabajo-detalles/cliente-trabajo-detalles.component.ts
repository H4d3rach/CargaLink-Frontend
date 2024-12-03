import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { CommonModule } from '@angular/common';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-trabajo-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cliente-trabajo-detalles.component.html',
  styleUrl: './cliente-trabajo-detalles.component.css'
})
export class ClienteTrabajoDetallesComponent implements OnInit{
  isSidebarCollapsed: boolean = false; //Variables de control que ayudan a mostrar componentes en el html
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  idOferta: number = 0;
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private router = inject(Router);
  private route =  inject(ActivatedRoute);
  oferta ?: modeloOferta;
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
    this._oferta.seeOfertaDetails(this.idOferta).subscribe((ofertaData)=>{
      this.oferta = ofertaData;
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
  isEmb(carga: Carga): carga is Embalaje{
    return carga.tipo==="EMBALAJE";
  }
  isCont(carga: Carga): carga is Contenedor{
    return carga.tipo === "CONTENEDOR";
  }
  isSlt(carga: Carga): carga is Suelta{
    return carga.tipo ==="SUELTA";
  }
  preguntarChat(){
    this.historialMensajesChatbot.push({clase: 'usuario', msj: this.preguntaChat});
    this._chatbot.usarChatbot(this.preguntaChat).subscribe((respuesta)=>{
      this.historialMensajesChatbot.push({clase: 'bot', msj: respuesta.respuesta});
      localStorage.setItem('chatMensajes', JSON.stringify(this.historialMensajesChatbot));
    })
    this.preguntaChat=""
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  logout(){ //Metodo que ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
