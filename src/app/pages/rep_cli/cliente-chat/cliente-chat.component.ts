import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ChatService } from '../../../servicios/chats/chat.service';
import { modeloUsuario } from '../../../servicios/chats/modeloMensaje';

@Component({
  selector: 'app-cliente-chat',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-chat.component.html',
  styleUrl: './cliente-chat.component.css'
})
export class ClienteChatComponent implements OnInit{
  private _login = inject(LoginService);
  private _chat = inject(ChatService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  usuariosChat: modeloUsuario[] = [];
  idUser: string = "";
  constructor(){
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
    this._chat.getAllMyChats().subscribe((chats)=>{
        this.usuariosChat = chats
                            .flatMap(chat => [chat.usuario1, chat.usuario2])
                            .filter(usuario => usuario.idUsuario != this.idUser);
        console.log(this.usuariosChat);
    })
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  chat(id: string){
    this.router.navigate(['/cliente/chat/',id]);
  }
  logout(){ //Funcion que nos ayuda a cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
