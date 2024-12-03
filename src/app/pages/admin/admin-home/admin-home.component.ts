import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ValidacionService } from '../../../servicios/admin/validacion.service';
import { Router } from '@angular/router';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';
import { modeloUsuario } from '../../../servicios/chats/modeloMensaje';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { modeloValidacion } from '../../../servicios/admin/validation';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
  private _login = inject(LoginService);
  private _validacion = inject(ValidacionService);
  private router = inject(Router);
  private _chatbot = inject(ChatBService);
  private _oferta =  inject(OfertaService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  solicitantes: modeloValidacion[] = [];
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
    this._validacion.verSolicitudes().subscribe((usuarios)=>{
      this.solicitantes = usuarios;
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
  getDoc(nombre: string){
    this._oferta.getPdf(nombre).subscribe({
      next: (blob)=>{
        const url = URL.createObjectURL(blob);
        window.open(url,'_blank')
      },
      error: (error)=>{
        console.log("Error al abrir el pdf");
      }
    });
  }
  validarCuenta(id: string){
    this._validacion.validarCuenta(id).subscribe({
      next: ()=>{
        this.solicitantes = this.solicitantes.filter(user => user.idUsuario != id);
      },
      error: (error) =>{
        console.log(error)
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
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  logout(){ //Funcion que nos ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
