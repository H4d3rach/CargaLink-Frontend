import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { CommonModule, Location } from '@angular/common';
import { modeloVehiculo } from '../../../servicios/vehiculos/modeloVehiculo';
import { transSeguroModelo } from '../../../servicios/transportistas/transSeguroModelo';
import { modeloSemirremolque } from '../../../servicios/semirremolques/modeloSemirremolque';
import { modeloRecursos } from '../../../servicios/ofertas/modeloRecursos';

@Component({
  selector: 'app-cliente-oferta-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-oferta-detalles.component.html',
  styleUrl: './cliente-oferta-detalles.component.css'
})
export class ClienteOfertaDetallesComponent implements OnInit{
  private _login = inject(LoginService);
  private _oferta =  inject(OfertaService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  isSidebarCollapsed: boolean = false; //Variables de control que ayudan a mostrar componentes en el html
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  idOferta: number = 0;
  oferta?: modeloOferta;
  recursos: modeloRecursos[]=[];
  constructor(){
    this.idOferta = Number(this.route.snapshot.paramMap.get('idTrabajo'));
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
      if(ofertaData.estatus == 'CONFIGURADO' || this.oferta.estatus=='FINALIZADO' || this.oferta.estatus=='PAGADO'){
        this._postulacion.getResourcesByOferta(ofertaData.idOferta).subscribe((listaRecursos)=>{
          this.recursos = listaRecursos;
        })
      }
    })
  }
  downloadContrato(nombre: string){
    this._oferta.getPdf(nombre).subscribe({
      next: (blob)=>{
        const url = URL.createObjectURL(blob);
        window.open(url,'_blank')
      },
      error: (error)=>{
        console.log("Error al abrir el pdf");
      }
    });
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
  volver(){
    this.location.back();
  }
  pagar(){
    this.router.navigate(['/cliente/gestion/trabajo/pagar/', this.idOferta])
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
}
