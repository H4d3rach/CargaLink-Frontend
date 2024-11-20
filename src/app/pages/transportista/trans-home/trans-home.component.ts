import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { FormsModule } from '@angular/forms';
import { TransportistaService } from '../../../servicios/transportistas/transportista.service';

@Component({
  selector: 'app-trans-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './trans-home.component.html',
  styleUrl: './trans-home.component.css'
})
export class TransHomeComponent implements OnInit{
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private _trans = inject(TransportistaService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isInTravel: boolean = false; //CHECAR!!!!!!!!!!!!!!
  isUserLogged: boolean = false;
  oferta?: modeloOferta;
  estatusSeleccionado: string = ''; 
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({
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
    this._oferta.viewOfertaTransportista().subscribe({
      next: (OFERTA)=>{
        this.oferta = OFERTA;
        this.isInTravel = true;
      },
      error: (error)=>{
        this.isInTravel = false;
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
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  actualizarEstatus(){
    if (this.estatusSeleccionado) {
      this._trans.changeEstatus(this.estatusSeleccionado).subscribe({
        next: ()=>{
          console.log("Todo bien")
        },
        error: (error)=>{
          console.log(error)
        }
      })
    } else {
      console.log('Por favor, selecciona un estatus.');
    }
  }
  logout(){
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
