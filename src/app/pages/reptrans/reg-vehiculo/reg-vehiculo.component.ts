import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { modeloSede } from '../../../servicios/sedes/modeloSede';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '../../../servicios/vehiculos/vehiculo.service';
import { modeloVehiculo } from '../../../servicios/vehiculos/modeloVehiculo';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-reg-vehiculo',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink, FormsModule],
  templateUrl: './reg-vehiculo.component.html',
  styleUrl: './reg-vehiculo.component.css'
})
export class RegVehiculoComponent implements OnInit{
  private _login = inject(LoginService) //Inyeccion del servicio de login
  private _sede = inject(SedeService); //Inyeccion del servicio de sedes
  private _vehiculo = inject(VehiculoService); //Inyeccion del servicio de vehiculos
  private router = inject(Router) //Inyeccion del router
  isSidebarCollapsed: boolean = false; //Variables de control que nos ayudará a mostrar o no componentes en el html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isCUSelected: boolean = false;
  isUserLogged: boolean = false;
  isSedeRegister: boolean = false;
  errorVehiculo: string = ""; //Variables para obtener errores y mostrar alertas en el html
  errorBool: boolean = false;
  sedeList: modeloSede[] = [];
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){ //Inyeccion del formBuilder

  }
  vehiculoForm = this.formBuilder.group( //Creacion del formulario
    {
      placa: ['',[Validators.required]],
      peso: ['',[Validators.required, Validators.pattern('^[1-9][0-9]{3,4}$')]],
      noEjes: ['',[Validators.required, Validators.pattern('^[1-9]$')]],
      noLlantas: ['',[Validators.required, Validators.pattern('^([1-9]|[1][0-2])$')]],
      largo: ['',[Validators.required, Validators.pattern('^(1[0-3](\.[0-9]{1,2})?|[1-9](\.[0-9]{1,2})?$)')]],
      marca: ['',[Validators.required]],
      tipo: ['',[Validators.required]],
      estatus: ['',[Validators.required]],
      modelo: ['',[Validators.required]],
      sede : ['',[Validators.required]],
      tipoCamion: [''] 
    }
  )
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
  registrarVehiculo(){ //Metodo que nos ayuda a registrar el vehiculo, utiliza el servicio de vehiculo
    if(this.vehiculoForm.valid){ //Se comunica con el backend solo cuando los datos del formulario son válidos
      let body = {} //Construccion del body request para el caso de camion unitario o tracto dependiendo de lo ingresado en el formulario
      if(this.isCUSelected){
        body = {
          placa: this.vehiculoForm.get('placa')?.value,
          peso: this.vehiculoForm.get('peso')?.value,
          noEjes: this.vehiculoForm.get('noEjes')?.value,
          noLlantas: this.vehiculoForm.get('noLlantas')?.value,
          largo: this.vehiculoForm.get('largo')?.value,
           marca: this.vehiculoForm.get('marca')?.value,
          tipo: this.vehiculoForm.get('tipo')?.value,
          estatus: this.vehiculoForm.get('estatus')?.value,
          modelo: this.vehiculoForm.get('modelo')?.value,
          sede : {idSede: this.vehiculoForm.get('sede')?.value},
          tipoCamion: this.vehiculoForm.get('tipoCamion')?.value
        }
      }
      else{
      body = {
        placa: this.vehiculoForm.get('placa')?.value,
        peso: this.vehiculoForm.get('peso')?.value,
        noEjes: this.vehiculoForm.get('noEjes')?.value,
        noLlantas: this.vehiculoForm.get('noLlantas')?.value,
        largo: this.vehiculoForm.get('largo')?.value,
         marca: this.vehiculoForm.get('marca')?.value,
        tipo: this.vehiculoForm.get('tipo')?.value,
        estatus: this.vehiculoForm.get('estatus')?.value,
        modelo: this.vehiculoForm.get('modelo')?.value,
        sede : {idSede: this.vehiculoForm.get('sede')?.value}
      }
    }
      this._vehiculo.crearVehiculo(body as modeloVehiculo).subscribe({ //Ocupa el servicio del login, el cual si todo sale bien, retorna el token
        next: () => {
          console.log("Vehiculo creado");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorVehiculo = errorData;
        },
        complete: () => { //Una vez que se obtiene la respuesta
          this.errorBool= false;
          this.router.navigateByUrl('rep_trans/vehiculos');
          this.vehiculoForm.reset();
        }
      })
      
    }
    else{
      console.log("Error en el formulario")
      this.vehiculoForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
  }
  onChange(event: any) {
    const selectedValue = event.target.value;
    this.isCUSelected = selectedValue === 'CAMION_UNITARIO';
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  seleccionCU(){
    this.isCUSelected = !this.isCUSelected;
  }
  logout(){ //Funcion para cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  get placa(){ //Nos ayuda a obtener el control del input de LA PLACA para Llamarlo desde el html
    return this.vehiculoForm.controls.placa;
  }
  get peso(){ //Nos ayuda a obtener el control del input del peso para Llamarlo desde el html
    return this.vehiculoForm.controls.peso;
  }
  get noEjes(){ //Nos ayuda a obtener el control del input del numero de ejes para Llamarlo desde el html
    return this.vehiculoForm.controls.noEjes;
  }
  get noLlantas(){ //Nos ayuda a obtener el control del input deñ numero de llantas para Llamarlo desde el html
    return this.vehiculoForm.controls.noLlantas;
  }
  get largo(){ //Nos ayuda a obtener el control del input de Largo para Llamarlo desde el html
    return this.vehiculoForm.controls.largo;
  }
  get marca(){ //Nos ayuda a obtener el control del input de LA marca para Llamarlo desde el html
    return this.vehiculoForm.controls.marca;
  }
  get tipo(){ //Nos ayuda a obtener el control del input del tipo para Llamarlo desde el html
    return this.vehiculoForm.controls.tipo;
  }
  get estatus(){ //Nos ayuda a obtener el control del input del estatus para Llamarlo desde el html
    return this.vehiculoForm.controls.estatus;
  }
  get modelo(){ //Nos ayuda a obtener el control del input del modelo para Llamarlo desde el html
    return this.vehiculoForm.controls.modelo
  }
  get sede(){ //Nos ayuda a obtener el control del input de LA sede para Llamarlo desde el html
    return this.vehiculoForm.controls.sede;
  }
  get tipoCamion(){//Nos ayuda a obtener el control del input del tipo de camion para Llamarlo desde el html
    return this.vehiculoForm.controls.tipoCamion;
  }
}
