import { Component, inject } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-see-viaje-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './see-viaje-details.component.html',
  styleUrl: './see-viaje-details.component.css'
})
export class SeeViajeDetailsComponent {
  private _login = inject(LoginService);
  private _oferta =  inject(OfertaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean =  false;
  idOferta: number = 0;
  oferta?: modeloOferta;
  diferentEstatus: boolean = false;
  constructor(private formBuilder: FormBuilder){
    this.idOferta = Number(this.route.snapshot.paramMap.get('idTrabajo'));
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
    this._oferta.seeOfertaDetailsRepTrans(this.idOferta).subscribe((ofertaData)=>{
      this.oferta = ofertaData;
      if(ofertaData.estatus != 'CONFIGURANDO'){
        this.diferentEstatus = true;
      }
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
  addResources(){
    this.router.navigate(['/rep_trans/configurarViaje/',this.idOferta]);
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
