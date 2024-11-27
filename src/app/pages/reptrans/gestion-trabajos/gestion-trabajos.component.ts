import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { modeloPostulcion } from '../../../servicios/postulaciones/modeloPostulacion';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';

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
  viajesActualesList: modeloPostulcion[] = [];
  viajesFinalizadosList: modeloPostulcion[]=[];
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
    
    this._postulacion.viewAlMyPostulaciones().subscribe((postulacionData)=>{
      this.postulacionList = postulacionData.filter(postulacion => postulacion.oferta.estatus === 'OFERTA');
      this.viajesActualesList = postulacionData.filter(postulacion => postulacion.oferta.estatus != 'OFERTA' && postulacion.oferta.estatus != 'PAGADO');
      this.despliegueViajesActuales();
      this.viajesFinalizadosList = postulacionData.filter(postulacion => postulacion.oferta.estatus === 'PAGADO');
    })
  }
  despliegueViajesActuales(){
    const promesa = this.viajesActualesList.map(postulacion => {
      const ofertaId = postulacion.oferta.idOferta;
      return this._postulacion.getResourcesByOferta(ofertaId).toPromise().then(recursos =>{
        postulacion.oferta.recursos = recursos;
      });
    });
    Promise.all(promesa).then(()=>{
      this.viajesActualesList.forEach(element => {
      });
      const estadoOrden = ['CONFIGURANDO','FINALIZADO','CONFIGURADO']; 
      this.viajesActualesList.sort((a, b) => { 
        return estadoOrden.indexOf(a.oferta.estatus??'') - estadoOrden.indexOf(b.oferta.estatus??'  '); 
      });
    });
  }
  despliegueViajesTerminados(){
    const promesa = this.viajesFinalizadosList.map(postulacion => {
      const ofertaId = postulacion.oferta.idOferta;
      return this._postulacion.getResourcesByOferta(ofertaId).toPromise().then(recursos =>{
        postulacion.oferta.recursos = recursos;
      });
    });
    Promise.all(promesa);
  }
 eliminar(id:number){
  this._postulacion.deletePostulacion(id).subscribe({
    next: ()=>{
      console.log("Postulacion eliminada")
      this.postulacionList = this.postulacionList.filter(postulacion => postulacion.idPostulacion != id);
    },
    error : (error)=>{
      console.log(error);
    }
  })
 }
 detailsViaje(id: number){
  this.router.navigate(['/rep_trans/detallesViaje/',id]);
 }
 formatText(text: string | undefined): string { //Metodo que ayuda a  darle formato a respuestas que lo requieran
  if(text){
  return text
    .toLowerCase()
    .replace(/_/g,' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());}
    else{
      return "";
    }
}
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  chat(id:string | undefined){
    this.router.navigate(['/rep_trans/chat/',id]);
  }
  logout(){ //Metodo que nos ayuda a cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
