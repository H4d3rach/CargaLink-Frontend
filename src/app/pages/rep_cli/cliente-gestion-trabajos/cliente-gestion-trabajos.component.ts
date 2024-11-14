import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';

@Component({
  selector: 'app-cliente-gestion-trabajos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-gestion-trabajos.component.html',
  styleUrl: './cliente-gestion-trabajos.component.css'
})
export class ClienteGestionTrabajosComponent implements OnInit {
  
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  ofertasPublicadasList: modeloOferta[]=[];
  viajesEnCursoList: modeloOferta[]=[];
  viajesFinalizados: modeloOferta[]=[];
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
    this._oferta.viewMyOfertas().subscribe((ofertasData)=>{
      this.ofertasPublicadasList = ofertasData.filter(oferta => oferta.estatus === 'OFERTA');
      const estatusEnCurso = [
        'CONFIGURANDO', 
        'RECOGIENDO', 
        'EMBARCANDO', 
        'EN_CAMINO', 
        'PROBLEMA', 
        'ENTREGADO', 
        'FINALIZADO'
      ];
      this.viajesEnCursoList = ofertasData.filter(oferta => oferta.estatus && estatusEnCurso.includes(oferta.estatus));
      this.viajesFinalizados = ofertasData.filter(oferta => oferta.estatus === 'PAGADO')
    }
    )
  }
  verPostulaciones(id: number){
    this.router.navigate(['/cliente/gestion/oferta/postulaciones/',id]);
  }
  verDetalles(id: number){
    this.router.navigate(['/cliente/gestion/oferta/detalles/',id])
  }
  eliminar(id: number){
    this._oferta.deleteOferta(id).subscribe({
      next: ()=>{
        console.log("Oferta eliminada");
        this.ofertasPublicadasList = this.ofertasPublicadasList.filter(oferta => oferta.idOferta != id);
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  logout(){ //Metodo que ayuda a cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
