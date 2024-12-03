import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { SemirremolqueService } from '../../../servicios/semirremolques/semirremolque.service';
import { modeloSede } from '../../../servicios/sedes/modeloSede';
import { modeloSemirremolque } from '../../../servicios/semirremolques/modeloSemirremolque';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-upd-semi',
  standalone: true,
  imports: [CommonModule, RouterLink,ReactiveFormsModule, FormsModule],
  templateUrl: './upd-semi.component.html',
  styleUrl: './upd-semi.component.css'
})
export class UpdSemiComponent implements OnInit{
  private _login = inject(LoginService); //Inyeccion del servicio de login
  private _sede = inject(SedeService); //Inyeccion del servicio de sede
  private _semirremolque = inject(SemirremolqueService); //Inyeccion del servicio de semirremolque
  private router = inject(Router); //Inyeccion del router
  private route = inject(ActivatedRoute); //Inyeccion del activated route
  isSidebarCollapsed: boolean = false; // Variables de control que nos ayudan a desplegar elementos en el html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  errorBool: boolean = false;
  errorSemi: string = ""; 
  idSemi: number = 0;
  sedeList: modeloSede[] = [];
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){
    this.idSemi = Number(this.route.snapshot.paramMap.get('id')); //Obtencion del id por medio de la url
  }
  semiForm = this.formBuilder.group({ //Creacion del formulario
    nombreIdentificador: ['',[Validators.required]],
    estatus: ['',[Validators.required]],
    tipo: ['',[Validators.required]],
    largo: [0,[Validators.required]],
    ancho: [0,[Validators.required]],
    alto: [0,[Validators.required]],
    peso: [0,[Validators.required]],
    noEjes: [0,[Validators.required]],
    noLlantas: [0,[Validators.required]],
    sede : [0,[Validators.required]]
  })
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({ //Esta suscripción a el servicio login nos ayudará a detectar que el usuario esté logueado
      next:(isUserLogged)=>{              //Si no es así se dirige a la ventana de login
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
    this._sede.getAllSedes().subscribe((sedeData)=>{ //Suscripcion que nos ayudará a obtener todas las sedes
      this.sedeList = sedeData;
    })

    this._semirremolque.getSemi(this.idSemi).subscribe({ //Suscripcion que nos ayudará a obtener el semirremolque a modificar
      next:(semi)=>{
        this.semiForm.patchValue({
          nombreIdentificador: semi.nombreIdentificador,
          estatus : semi.estatus,
          tipo : semi.tipo,
          largo: semi.largo,
          ancho: semi.ancho,
          alto: semi.alto,
          peso: semi.peso,
          noLlantas: semi.noLlantas,
          noEjes: semi.noEjes,
          sede: semi.sede.idSede
        });
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    });
    const historial = localStorage.getItem('chatMensajes');
  if(historial){
    this.historialMensajesChatbot = JSON.parse(historial);
  }
  const chatOpenGuardado = localStorage.getItem('chatOpen'); 
  if(chatOpenGuardado){
    this.chatOpen = chatOpenGuardado === 'true';
  }
  }

  actualizarSemi(){
    if(this.semiForm.valid){ //Se comunica con el backend solo cuando los datos del formulario son válidos
      let body = { //Construccion del body request para modificar un semirremolque
        idSemirremolque: this.idSemi,
        nombreIdentificador: this.semiForm.get('nombreIdentificador')?.value,
        estatus: this.semiForm.get('estatus')?.value,
        tipo: this.semiForm.get('tipo')?.value,
        largo: this.semiForm.get('largo')?.value,
        ancho: this.semiForm.get('ancho')?.value,
        alto: this.semiForm.get('alto')?.value,
        peso: this.semiForm.get('peso')?.value,
        noEjes: this.semiForm.get('noEjes')?.value,
        noLlantas: this.semiForm.get('noLlantas')?.value,
        sede : {
          idSede: this.semiForm.get('sede')?.value,
        }
      }
      this._semirremolque.updateSemi(body as modeloSemirremolque).subscribe({ //Ocupa el servicio del semirremolque
        next: () => {
          console.log("Semirremolque modificado");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorSemi = errorData;
        },
        complete: () => { //Una vez que se obtiene la respuesta
          this.errorBool= false;
          this.router.navigateByUrl('rep_trans/semirremolques');
          this.semiForm.reset();
        }
      })
      
    }
    else{
      console.log("Error en el formulario")
      this.semiForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  logout(){ //Funcion para cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  //Variables que se obtienen para tener el form control desde el html
  get nombreIdentificador(){
    return this.semiForm.controls.nombreIdentificador;
  }
  get estatus(){
    return this.semiForm.controls.estatus;
  }
  get tipo(){
    return this.semiForm.controls.tipo;
  }
  get largo(){
    return this.semiForm.controls.largo
  }
  get ancho(){
    return this.semiForm.controls.ancho;
  }
  get alto(){
    return this.semiForm.controls.alto;
  }
  get peso(){
    return this.semiForm.controls.peso;
  }
  get noEjes(){
    return this.semiForm.controls.noEjes;
  }
  get noLlantas(){
    return this.semiForm.controls.noLlantas;
  }
  get sede(){
    return this.semiForm.controls.sede;
  }
}
