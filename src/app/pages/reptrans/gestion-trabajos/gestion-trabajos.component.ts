import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { modeloPostulcion } from '../../../servicios/postulaciones/modeloPostulacion';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';

@Component({
  selector: 'app-gestion-trabajos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestion-trabajos.component.html',
  styleUrl: './gestion-trabajos.component.css'
})
export class GestionTrabajosComponent implements OnInit{
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  private _login =  inject(LoginService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  postulacionList: modeloPostulcion[] = [];
  isUserLogged: boolean =  false;
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({ //Metodo que ayuda a detectar si un usuario está loggeado o no
      next:(isUserLogged)=>{
        this.isUserLogged =isUserLogged;
      },
      error: (errorData) =>{
        console.log(errorData);
      },
      complete: () => { //En caso de no estar loggeado se redirige a la ventana de login
        if(this.isUserLogged == false){
          this.router.navigateByUrl('login');
        }
      }
    });
    let user = {idUsuario: ""}
      const userInfo = sessionStorage.getItem('UserInfo');
      if(userInfo){
        user = JSON.parse(userInfo);
      }
    this._postulacion.viewAlMyPostulaciones(user.idUsuario).subscribe((postulacionData)=>{
      console.log(postulacionData)
      this.postulacionList = postulacionData;
      //console.log(this.postulacionList)
    })
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  logout(){ //Metodo que nos ayuda a cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
