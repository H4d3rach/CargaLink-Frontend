import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { modeloPostulcion } from '../../../servicios/postulaciones/modeloPostulacion';

@Component({
  selector: 'app-cliente-oferta-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
  }
  chat(id:string | undefined){
    this.router.navigate(['/cliente/chat/',id]);
  }
  logout(){ //Metodo que ayuda a cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
