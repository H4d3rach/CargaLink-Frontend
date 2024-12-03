import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { modeloRecursos } from '../../../servicios/ofertas/modeloRecursos';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-see-viaje-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './see-viaje-details.component.html',
  styleUrl: './see-viaje-details.component.css'
})
export class SeeViajeDetailsComponent implements OnInit{
  private _login = inject(LoginService);
  private _oferta =  inject(OfertaService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location)
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean =  false;
  idOferta: number = 0;
  oferta?: modeloOferta;
  diferentEstatus?: string = '';
  recursos: modeloRecursos[]=[];
  isInProblem: boolean = false;
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
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
      this.diferentEstatus = ofertaData.estatus;
      if(ofertaData.estatus == 'CONFIGURADO' || this.oferta.estatus=='FINALIZADO' || this.oferta.estatus=='PAGADO'){
        this._postulacion.getResourcesByOferta(ofertaData.idOferta).subscribe((listaRecursos)=>{
          this.recursos = listaRecursos;
          this.recursos.forEach((recurso)=>{
            if(recurso.estatus == 'PROBLEMA'){
              this.isInProblem = true;
            }
          })
        })
      }
    })
    const historial = localStorage.getItem('chatMensajes');
  if(historial){
    this.historialMensajesChatbot = JSON.parse(historial);
  }
  const chatOpenGuardado = localStorage.getItem('chatOpen'); 
  if(chatOpenGuardado){
    this.chatOpen = chatOpenGuardado === 'true';
  }
  }
  preguntarChat(){
    this.historialMensajesChatbot.push({clase: 'usuario', msj: this.preguntaChat});
    this._chatbot.usarChatbot(this.preguntaChat).subscribe((respuesta)=>{
      this.historialMensajesChatbot.push({clase: 'bot', msj: respuesta.respuesta});
      localStorage.setItem('chatMensajes', JSON.stringify(this.historialMensajesChatbot));
    })
    this.preguntaChat=""
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
  changeRecursos(){
    this.router.navigate(['/rep_trans/modificarViaje/', this.idOferta]);
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
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  logout(){ //Metodo que nos ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  volver(){
    this.location.back();
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
