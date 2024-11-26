import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { FormsModule } from '@angular/forms';
import { TransportistaService } from '../../../servicios/transportistas/transportista.service';
import { modeloRecursos } from '../../../servicios/ofertas/modeloRecursos';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';

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
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isInTravel: boolean = false; //CHECAR!!!!!!!!!!!!!!
  isInProblem: boolean = false;
  isUserLogged: boolean = false;
  oferta?: modeloOferta;
  estatusSeleccionado: string = ''; 
  recurso?: modeloRecursos;
  idUser: string = "";
  estatusActual: string = "";
  flujoEstatus: {[key: string]: string}={
    'RECOGIENDO': 'EMBARCANDO',
    'EMBARCANDO': 'EN_CAMINO',
    'EN_CAMINO': 'ENTREGADO'
  }
  constructor(){
    const userInfo =sessionStorage.getItem('UserInfo');
    if(userInfo){
      const userInfoJson = JSON.parse(userInfo);
      this.idUser = userInfoJson.idUsuario;
    }
  }
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
        this._postulacion.getMyResource(this.oferta.idOferta).subscribe((myPost)=>{
          this.recurso = myPost;
          if(myPost.estatus=='PROBLEMA')
            this.isInProblem = true;
        })
      },
      error: (error)=>{
        this.isInTravel = false;
        this._trans.getTrans(this.idUser).subscribe((dataUser)=>{
          this.estatusActual = dataUser.estatusTransportista;
        });
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
          this.estatusActual = this.estatusSeleccionado;

        },
        error: (error)=>{
          console.log(error)
        }
      })
    } else {
      console.log('Por favor, selecciona un estatus.');
    }
  }
  reportarProblema(){
    this._postulacion.updateEstatus(this.recurso?.idRecurso,'PROBLEMA').subscribe({
      next: ()=>{
        this.recurso = { ...this.recurso, estatus: 'PROBLEMA' };
        this.isInProblem=true;
      },
      error: (error)=>{
        console.error(error);
      }
    })
  }
  solucionarProblema(){
    this._postulacion.updateEstatus(this.recurso?.idRecurso,'RECOGIENDO').subscribe({
      next: ()=>{
        this.recurso = { ...this.recurso, estatus: 'RECOGIENDO' };
        this.isInProblem=false;
      },
      error: (error)=>{
        console.error(error);
      }
    })
  }
  siguienteTexto(currentEstatus?: string): string | null{
    if(!currentEstatus)return null;
    const next = this.flujoEstatus[currentEstatus];
    switch(next){
      case 'EMBARCANDO':
        return 'Embarcar';
      case 'EN_CAMINO':
        return 'Iniciar viaje';
      case 'ENTREGADO':
        return 'Entregar'
      default:
        return null;
    }
  }
  siguienteEstatus(currentEstatus?: string){
    return currentEstatus ? this.flujoEstatus[currentEstatus] || null: null;
  }
  updateEstatus(currentEstatus?: string){
    const next = this.siguienteEstatus(currentEstatus);
    if(next){
      this._postulacion.updateEstatus(this.recurso?.idRecurso,next).subscribe(()=>{
        this.recurso = { ...this.recurso, estatus: next };
      })
    }
  }
  formatText(text: string | undefined): string { //Metodo que ayuda a  darle formato a respuestas que lo requieran
    if(text){
    return text
      .toLowerCase()
      .replace(/_/g,' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    }else{
      return "";
    }
  }

  logout(){
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
