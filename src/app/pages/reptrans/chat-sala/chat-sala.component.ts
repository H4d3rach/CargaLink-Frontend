import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ChatService } from '../../../servicios/chats/chat.service';
import { modeloMensaje } from '../../../servicios/chats/modeloMensaje';

@Component({
  selector: 'app-chat-sala',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './chat-sala.component.html',
  styleUrl: './chat-sala.component.css'
})
export class ChatSalaComponent {
  private _login = inject(LoginService);
  private _chat = inject(ChatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  idCliente: string = "";
  idUser: string = "";
  idChat: number = 0;
  messagesList:modeloMensaje[] = [];
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  constructor(){
    this.idCliente = String(this.route.snapshot.paramMap.get('idCliente')); 
    const userInfo =sessionStorage.getItem('UserInfo');
    if(userInfo){
      const userInfoJson = JSON.parse(userInfo);
      this.idUser = userInfoJson.idUsuario;
    }
  }
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
      this.idChat = chat;
      this._chat.getMessages(this.idChat).subscribe(messages =>{
        this.messagesList = messages;
      })
    })
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
}
