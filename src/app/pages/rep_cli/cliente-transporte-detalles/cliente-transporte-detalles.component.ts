import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstrellasComponent } from "../estrellas/estrellas.component";
import { modeloRegTrans } from '../../../servicios/registro/modeloRegTrans';
import { Calificaciones, modeloRepTrans } from '../../../servicios/postulaciones/modeloRepTrans';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';

@Component({
  selector: 'app-cliente-transporte-detalles',
  standalone: true,
  imports: [EstrellasComponent, RouterLink],
  templateUrl: './cliente-transporte-detalles.component.html',
  styleUrl: './cliente-transporte-detalles.component.css'
})
export class ClienteTransporteDetallesComponent implements OnInit{
  private _login = inject(LoginService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isUserLogged: boolean = false;
  isSidebarCollapsed: boolean = false; //Variables de control que ayudan a mostrar componentes en el html
  chatOpen: boolean = false;
  isTraveled: boolean = false;
  idRepresentante: string = "";
  representante?: modeloRepTrans;
  comentarios: string[] = [];
  puntualidad: number = 0;
    estadoCarga: number = 0;
    precio: number = 0;
    atencion: number = 0;
    promedio: number = 0;
  constructor(){
    this.idRepresentante = String(this.route.snapshot.paramMap.get('idRepresentante'));
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
    this._postulacion.viewDetallesRepTrans(this.idRepresentante).subscribe((repData)=>{
      this.representante = repData;
      
      if(this.representante && this.representante.calificaciones.length > 0){
        this.isTraveled = true;
        this.calcularPromedios(this.representante.calificaciones)
      }
    })
  }

  calcularPromedios(calificaciones: Calificaciones[]): void{
    let totalPuntualidad = 0;
    let totalEstadoCarga = 0;
    let totalPrecio = 0;
    let totalAtencion = 0;
    let totalPromedio = 0;
    for (let calificacion of calificaciones){
      this.comentarios.concat(calificacion.comentario);
      totalPuntualidad += calificacion.puntualidad;
      totalEstadoCarga += calificacion.estadoCarga;
      totalPrecio += calificacion.precio;
      totalAtencion += calificacion.atencion;
      totalPromedio += calificacion.promedio;
    }
    const cantidadCalificaciones = calificaciones.length;
    this.puntualidad = totalPuntualidad / cantidadCalificaciones;
    this.estadoCarga = totalEstadoCarga / cantidadCalificaciones;
    this.precio = totalPrecio / cantidadCalificaciones;
    this.atencion = totalAtencion / cantidadCalificaciones;
    this.promedio = totalPromedio / cantidadCalificaciones;
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
