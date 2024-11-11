import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-trabajo-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-trabajo-detalles.component.html',
  styleUrl: './cliente-trabajo-detalles.component.css'
})
export class ClienteTrabajoDetallesComponent implements OnInit{
  isSidebarCollapsed: boolean = false; //Variables de control que ayudan a mostrar componentes en el html
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  idOferta: number = 0;
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private router = inject(Router);
  private route =  inject(ActivatedRoute);
  oferta ?: modeloOferta;
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
    this._oferta.seeOfertaDetails(this.idOferta).subscribe((ofertaData)=>{
      this.oferta = ofertaData;
    })
  }
  isEmb(carga: Carga): carga is Embalaje{
    return carga.tipo==="EMBALAJE";
  }
  isCont(carga: Carga): carga is Contenedor{
    return carga.tipo === "CONTENEDOR";
  }
  isSlt(carga: Carga): carga is Suelta{
    return carga.tipo ==="SUELTA";
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
