import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  isSidebarCollapsed: boolean = false; //Variables de control que nos ayudarán
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  ofertasList: modeloOferta[]= []; //Lista que guardará todas las ofertas disponibles
  //postulacionList: modeloOferta[] = [];
  private _login = inject(LoginService); //Inyeccion del servicio de login
  private _oferta = inject(OfertaService); //Inyeccion del servicio de oferta
  private _postulacion = inject(PostulacionService);
  private router = inject(Router); //Inyeccion del router
  private route = inject(ActivatedRoute);
  constructor(){
  }
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
    this._oferta.viewAllOfertas().subscribe((ofertaData)=>{
      const ofertasAll = ofertaData.filter(oferta => oferta.estatus === 'OFERTA');
      this._postulacion.viewAlMyPostulaciones().subscribe((postulacionData)=>{
        const postulaciones = postulacionData.map(postulacion => postulacion.oferta.idOferta);
        this.ofertasList = ofertasAll.filter(oferta => !postulaciones.includes(oferta.idOferta))
      })
    })
  }
  verDetalles(id: number){
    this.router.navigate(['/rep_trans/detalles_trabajo', id]);
  }
  postularse(id: number){
    this.router.navigate(['/rep_trans/postularse',id])
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  toggleCard(){
    this.isCardOpen = !this.isCardOpen;
  }

  logout(){ //Metodo que nos ayuda a cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
