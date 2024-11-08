import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { Router, RouterLink } from '@angular/router';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
@Component({
  selector: 'app-see-work-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './see-work-details.component.html',
  styleUrl: './see-work-details.component.css'
})
export class SeeWorkDetailsComponent implements OnInit{
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  ofertaDetails?: modeloOferta;
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
