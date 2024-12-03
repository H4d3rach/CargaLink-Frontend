import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { SemirremolqueService } from '../../../servicios/semirremolques/semirremolque.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { modeloSede } from '../../../servicios/sedes/modeloSede';
import { modeloSemirremolque } from '../../../servicios/semirremolques/modeloSemirremolque';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-reg-semirremolque',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink, FormsModule],
  templateUrl: './reg-semirremolque.component.html',
  styleUrl: './reg-semirremolque.component.css'
})
export class RegSemirremolqueComponent implements OnInit{
  private _login = inject(LoginService); //Inyeccion del servicio de login
  private _sede = inject(SedeService); //Inyeccion del servicio de sede
  private _semirremolque = inject(SemirremolqueService); //Inyeccion del servicio de semirremolque
  private router = inject(Router) //Inyeccin del router
  isSidebarCollapsed: boolean = false; //Variables de control para desplegar elementos en el html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  isSedeRegister: boolean = false;
  errorBool: boolean = false;
  errorSemi: string = ""; 
  sedeList: modeloSede[] = [];
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){

  }
  semiForm = this.formBuilder.group({ //Creación del formulario
    nombreIdentificador: ['',[Validators.required]],
    estatus: ['',[Validators.required]],
    tipo: ['',[Validators.required]],
    largo: ['',[Validators.required, Validators.pattern('^(?:[1-9](?:\.[0-9]{1,2})?|1[0-6](?:\.[0-9]{1,2})?)$')]],
    ancho: ['',[Validators.required, Validators.pattern('^(?:[1-9](?:\.[0-9]{1,2})?|2(?:\.[0-5][0-9]{0,1})?)$')]],
    alto: ['',[Validators.required, Validators.pattern('^(?:[1-4](?:\.[0-9]{1,2})?|4(?:\.[0-2][0-9]{0,1})?)$')]],
    peso: ['',[Validators.required, Validators.pattern('^[1-9][0-9]{3,4}$')]],
    noEjes: ['',[Validators.required, Validators.pattern('^[1-9]$')]],
    noLlantas: ['',[Validators.required, Validators.pattern('^([1-9]|[1][0-2])$')]],
    sede : ['',[Validators.required]]
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
      if (this.sedeList.length === 0) { //Condicion que nos ayuda a detectar si el usuario tiene registradas sedes para poder continuar
        this.isSedeRegister = false;
    } else {
        this.isSedeRegister = true;
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
  registrarSemi(){
    if(this.semiForm.valid){ //Se comunica con el backend solo cuando los datos del formulario son válidos
      let body = { //Construccion del body request con el objeto de semirremolque
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
      this._semirremolque.createSemi(body as  unknown as modeloSemirremolque).subscribe({ //Ocupa el servicio del semirremolque para registrar
        next: () => {
          console.log("Vehiculo creado");
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
      this.semiForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
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
  //Las siguientes funciones nos ayudan a obtener el control de los input del formulario para su manipulacion en el html
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
