import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carga, Contenedor, Embalaje, modeloOferta, Suelta } from '../../../servicios/ofertas/modeloOferta';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.css'
})
export class ClienteHomeComponent implements OnInit{
  isSidebarCollapsed: boolean = false; //Variables de control que ayudan a mostrar componentes en el html
  isEmbalaje: boolean = false;
  isSuelta: boolean = false;
  isContenedor: boolean =  false;
  chatOpen: boolean = false;
  isAgreeged: boolean = false;
  isSecondAgreeged: boolean = false;
  isUserLogged: boolean = false;
  errorOferta: string = ""; //Variables para obtener errores y mostrar alertas en el html
  errorBool: boolean = false;
  private _login = inject(LoginService); //Inyeccion del servicio del login
  private _oferta = inject(OfertaService); //Inyeccion del servicio de oferta
  private router = inject(Router); //Inyeccion del router
  pesoCargaTotal: number = 0; //Variable que nos ayudara a guardar el peso total de la oferta
  cargaList: Carga[]=[]; //Lista de las cargas
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){ //Inyeccion del foorm Builder

  }
  ofertaForm = this.formBuilder.group({ //Creacion del formulario
    descripcion: ['', [Validators.required]],
    lugarInicio: ['', [Validators.required]],
    lugarDestino: ['', [Validators.required]],
    fechaDestino: ['', [Validators.required]],
    horaDestino: ['', [Validators.required]],
    precio: ['', [Validators.required]],
    pesoTotal: [0],
    tipo: ['', [Validators.required]],
    embalajeTipo: [''],
    embalajeContenido: [''],
    embalajeUnidades: [''],
    embalajePeso: [''],
    embalajeLargo: [''],
    embalajeAlto: [''],
    embalajeAncho: [''],
    sueltaContenido: [''],
    sueltaPeso: [''],
    contenedorContenido: [''],
    contenedorLargo: [''],
    contenedorAlto: [''],
    contenedorAncho: [''],
    contenedorPeso: ['']
  })
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
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
    localStorage.setItem('chatOpen', this.chatOpen ? 'true' : 'false');
  }
  onChange(event: any) { //Metodo que ayuda a obtener el valor del select tipo de carga y ayuda a desplegar el formulario para cada tipo
    const selectedValue = event.target.value;
    this.isEmbalaje = selectedValue === 'EMBALAJE';
    this.isSuelta = selectedValue === 'SUELTA';
    this.isContenedor = selectedValue === 'CONTENEDOR';
  }
  agregarCarga(){
    this.isAgreeged = true;
    this.isSecondAgreeged = false;
    let tipoCarga = this.ofertaForm.get('tipo')?.value; //Obtención del tipo de carga
    if(tipoCarga== 'EMBALAJE'){ //Se verifica el tipo de carga
      const pesoUnitario = Number(this.ofertaForm.get('embalajePeso')?.value); //Obtencion de los valores del formulario
      const unidades = Number(this.ofertaForm.get('embalajeUnidades')?.value);
      const pesoTotal = pesoUnitario * unidades; //Calculo del peso de esta carga
      const tipoembalaje = String(this.ofertaForm.get('embalajeTipo')?.value);
      const content = String(this.ofertaForm.get('embalajeContenido')?.value);
      const largo = Number(this.ofertaForm.get('embalajeLargo')?.value);
      const ancho = Number(this.ofertaForm.get('embalajeAncho')?.value);
      const alto = Number(this.ofertaForm.get('embalajeAlto')?.value);
      this.pesoCargaTotal += pesoTotal; //Se le suma al peso total de la oferta el peso de la carga individual
      const carga: Embalaje = { //Creacion del body para la lista de cargas
        pesoTotal: pesoTotal,
        tipo: 'EMBALAJE',
        tipoEmbalaje: tipoembalaje,
        contenido: content,
        noUnidades: unidades,
        pesoUnitario: pesoUnitario,
        largo: largo,
        ancho: ancho,
        alto: alto
      }
      this.cargaList.push(carga); //Se agrega la carga a la lista
    }
    else if(tipoCarga== 'SUELTA'){ //Se verifica el tipo de carga
      const pesoTotal = Number(this.ofertaForm.get('sueltaPeso')?.value); //Obtencion de los valores del formulario
      const descripcion = String(this.ofertaForm.get('sueltaContenido')?.value);
      this.pesoCargaTotal += pesoTotal; //Calculo del peso de esta carga
      const carga: Suelta = { //Creacion del body para la lista de cargas
        pesoTotal: pesoTotal,
        tipo: 'SUELTA',
        descripcion: descripcion
      }
      this.cargaList.push(carga); //Se agrega la carga a la lista
    }
    else if(tipoCarga == 'CONTENEDOR'){ //Se verifica el tipo de carga
      const peso = Number(this.ofertaForm.get('contenedorPeso')?.value); //Obtencion de los valores del formulario
      const contenido = String(this.ofertaForm.get('contenedorContenido')?.value);
      const largo = Number(this.ofertaForm.get('contenedorLargo')?.value);
      const alto = Number(this.ofertaForm.get('contenedorAlto')?.value);
      const ancho = Number(this.ofertaForm.get('contenedorAncho')?.value);
      this.pesoCargaTotal += peso; //Calculo del peso de esta carga
      const carga: Contenedor = { //Creacion del body para la lista de cargas
        pesoTotal: peso,
        tipo: 'CONTENEDOR',
        contenido: contenido,
        largo: largo,
        ancho: ancho,
        alto: alto
      }
      this.cargaList.push(carga); //Se agrega la carga a la lista
    }
    this.ofertaForm.patchValue({
      pesoTotal: this.pesoCargaTotal //Se agrega el peso total al formulario para que el usuario lo pueda visualizar
    })
  }
  //Siguientes 3 metodos que nos ayudan a detectar que tipo de carga se seleccionó
  isEmb(carga: Carga): carga is Embalaje{
    return carga.tipo==="EMBALAJE";
  }
  isCont(carga: Carga): carga is Contenedor{
    return carga.tipo === "CONTENEDOR";
  }
  isSlt(carga: Carga): carga is Suelta{
    return carga.tipo ==="SUELTA";
  }

  publicarOferta(){ //Metodo que nos ayuda a publicar la oferta
    this.isAgreeged = false;
    this.isSecondAgreeged  = false;
    if(this.ofertaForm.valid){ //Verificar que los valores puestos en el formulario tengan el formato correcto
      const cargaDescripcion = String(this.ofertaForm.get('descripcion')?.value); //Obtencion de los valores del formulario
      const lugarInicio = String(this.ofertaForm.get('lugarInicio')?.value);
      const lugarDestino = String(this.ofertaForm.get('lugarDestino')?.value);
      const fechaDestino = String(this.ofertaForm.get('fechaDestino')?.value);
      const horaDestino = String(this.ofertaForm.get('horaDestino')?.value);
      const precio = Number(this.ofertaForm.get('precio')?.value);
      let body = { //Body request para crear la oferta
        descripcion: cargaDescripcion,
        lugarInicio: lugarInicio,
        lugarDestino: lugarDestino,
        fechaFin: fechaDestino,
        horaTermino: horaDestino,
        precio: precio,
        pesoTotal: this.pesoCargaTotal,
        cargas: this.cargaList
      }
      this._oferta.createOferta(body as modeloOferta).subscribe({ //Suscripcion al servicio de oferta y publica la oferta
        next: () => {
          console.log("Oferta Creada");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorOferta = errorData;
        },
        complete: () => { //Una vez que se obtiene la respuesta
          this.errorBool= false;
          this.router.navigateByUrl('cliente/gestion');
          this.ofertaForm.reset();
        }
      })
    }else{
      this.ofertaForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
  }
  addOther(){ //Metodo que nos despliega el formulario para añadir otra carga
    this.isAgreeged = false;
    this.isSecondAgreeged = true;
  }
  regresar(){ //Metodo que ayuda al formulario a regresar si no se desea a gregar otra carga
    this.isAgreeged = true;
    this.isSecondAgreeged = false;
  }

  logout(){ //Metodo que ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  //Controles del formulario que nos ayuda a verificar el estado del formulario
  get descripcion (){
    return this.ofertaForm.controls.descripcion;
  }
  get lugarInicio(){
    return this.ofertaForm.controls.lugarInicio
  }
  get lugarDestino(){
    return this.ofertaForm.controls.lugarDestino;
  }
  get fechaDestino(){
    return this.ofertaForm.controls.fechaDestino;
  }
  get horaDestino(){
    return this.ofertaForm.controls.horaDestino;
  }
  get precio(){
    return this.ofertaForm.controls.precio;
  }
  get tipo(){
    return this.ofertaForm.controls.tipo;
  }
}
