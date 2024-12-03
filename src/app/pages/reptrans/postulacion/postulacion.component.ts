import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { modeloPostulcion } from '../../../servicios/postulaciones/modeloPostulacion';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-postulacion',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './postulacion.component.html',
  styleUrl: './postulacion.component.css'
})
export class PostulacionComponent implements OnInit {
  private _login = inject(LoginService);
  private _oferta = inject(OfertaService);
  private _postulacion = inject(PostulacionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  idOferta: number = 0;
  errorBool: boolean = false;
  errorPostulacion: string = "";
  ofertaDetails?: modeloOferta;
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){
    this.idOferta = Number(this.route.snapshot.paramMap.get('idTrabajo'));
  }
  formPostulacion = this.formBuilder.group({
    precio: ["", [Validators.required]]
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
    this._oferta.seeOfertaDetails(this.idOferta).subscribe((ofertaData)=>{
      this.ofertaDetails = ofertaData;
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
  postularse(){
    if(this.formPostulacion.valid){
      let user = {idUsuario: ""}
      const userInfo = sessionStorage.getItem('UserInfo');
      if(userInfo){
        user = JSON.parse(userInfo);
      }
      let body ={
        oferta: {
          idOferta: this.idOferta
        },
        representanteTransporte: {
          idUsuario: user.idUsuario
        },
        precioPreeliminar : this.formPostulacion.get('precio')?.value
      }
      this._postulacion.createPostulacion(body as unknown as modeloPostulcion).subscribe({ //Ocupa el servicio del login, el cual si todo sale bien, retorna el token
        next: () => {
          console.log("Postulacion creada");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorPostulacion = errorData;
        },
        complete: () => { //Una vez que se obtiene la respuesta
          this.errorBool= false;
          this.router.navigateByUrl('rep_trans');
          this.formPostulacion.reset();
        }
      }
      )
    }
    else{
      this.formPostulacion.markAllAsTouched();
    }
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
  get precio(){
    return this.formPostulacion.controls.precio;
  }
}
