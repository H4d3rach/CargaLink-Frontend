import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ChatService } from '../../../servicios/chats/chat.service';
import { modeloMensaje, modeloUsuario } from '../../../servicios/chats/modeloMensaje';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { modeloChat } from '../../../servicios/chats/modeloChat';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-chat-sala',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './chat-sala.component.html',
  styleUrl: './chat-sala.component.css'
})
export class ChatSalaComponent {
  private _login = inject(LoginService);
  private _chat = inject(ChatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  idCliente: string = "";
  idUser: string = "";
  idChat: number = 0;
  chat?: modeloChat;
  otherUser?: modeloUsuario;
  myUser?: modeloUsuario;
  messagesList:modeloMensaje[] = [];
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  userInfo?:string | null;
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){
    this._chat.initConectionSocket(); 
    this.idCliente = String(this.route.snapshot.paramMap.get('idCliente')); 
    this.userInfo =sessionStorage.getItem('UserInfo');
    if(this.userInfo){
      const userInfoJson = JSON.parse(this.userInfo);
      this.idUser = userInfoJson.idUsuario;
    }
  }
  messageForm = this.formBuilder.group({
    mensaje: ['']
  })
  
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
    this._chat.getChat(this.idCliente).subscribe(chat => {
      this.chat = chat;
      this.idChat = this.chat.idChat;
      this._chat.unirseChat(this.idChat);
      if(this.chat.usuario1.idUsuario == this.idUser){
        this.myUser = this.chat.usuario1;
        this.otherUser = this.chat.usuario2;
      }else{
        this.myUser = this.chat.usuario2;
        this.otherUser = this.chat.usuario1;
      }
      console.log(this.chat)
      this._chat.getMessageSubject().subscribe(messages =>{
        this.messagesList = messages
      });
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
  sendMessage(){
    const mensaje = this.messageForm.get('mensaje')?.value;
    if(mensaje){
      this._chat.enviarMensaje(this.idChat, mensaje, this.idUser);
      const nuevoMensaje: modeloMensaje = {
        contenido: mensaje,
        usuario: {idUsuario: this.idUser},
        fecha: new Date()
      };
      this.messageForm.reset();
    }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  logout(){ //Funcion que nos ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  volver(){
    this.location.back();
  }
}
