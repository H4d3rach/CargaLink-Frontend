import { Component, inject, OnInit } from '@angular/core';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstrellasCalificacionComponent } from "../estrellas-calificacion/estrellas-calificacion.component";
import { modeloCalificacion, modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-trabajo-pagar',
  standalone: true,
  imports: [EstrellasCalificacionComponent, ReactiveFormsModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './cliente-trabajo-pagar.component.html',
  styleUrl: './cliente-trabajo-pagar.component.css'
})
export class ClienteTrabajoPagarComponent implements OnInit{
  private _login = inject(LoginService);
  private _oferta =  inject(OfertaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean =  false;
  idTrabajo: number = 0;
  diferentEstatus?: string = '';
  puntualidad:number = 0;
  estado:number = 0;
  precio:number = 0;
  atencion:number = 0;
  calificacion?:modeloCalificacion;
  isPaying: boolean = false;
  oferta?: modeloOferta;
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){
    this.idTrabajo = Number(this.route.snapshot.paramMap.get('idTrabajo'));
  }
  calificacionForm = this.formBuilder.group({
    comentario: ['',[Validators.required]]
  })
  pagoForm = this.formBuilder.group({
    nombre: ['',[Validators.required]],
    numeroTarjeta: ['',[Validators.required]],
    fecha: ['',[Validators.required]],
    cvv: ['',[Validators.required]]
  })
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
    this._oferta.seeOfertaDetails(this.idTrabajo).subscribe((ofertaData)=>{
      this.oferta = ofertaData;
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
  logout(){ //Metodo que nos ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  onPuntualitiChange(rate: number){
    this.puntualidad = rate;
  }
  onStateChange(rate: number){
    this.estado = rate;
  }
  onPriceChange(rate: number){
    this.precio = rate;
  }
  onAtencionChange(rate: number){
    this.atencion = rate;
  }
  calificar(){
    if(this.calificacionForm.valid){
      this.calificacion = {
        puntualidad: this.puntualidad,
        estadoCarga: this.estado,
        precio: this.precio,
        atencion: this.atencion,
        comentario: this.calificacionForm.get('comentario')?.value || ''
      }
    if(this.calificacion){
      this.isPaying = true;
    }
    }else{
      this.calificacionForm.markAllAsTouched();
      console.log("Todo mal")
    }
  }
  pagar(){
    if(this.pagoForm.valid){
    if(this.idTrabajo && this.calificacion){
      this._oferta.pagarViaje(this.idTrabajo, this.calificacion).subscribe({
        next: ()=>{
          this.router.navigateByUrl('cliente/gestion')
        },
        error: (error)=>{
          console.error(error);
        }
      })
    }
  }else{
    this.pagoForm.markAllAsTouched();
  }
  }
  get comentario(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.calificacionForm.controls.comentario;
  }
  get nombreForm(){
    return this.pagoForm.controls.nombre;
  }
  get numeroCard(){
    return this.pagoForm.controls.numeroTarjeta;
  }
  get fechaCard(){
    return this.pagoForm.controls.fecha;
  }
  get cvvCard(){
    return this.pagoForm.controls.cvv;
  }
}


