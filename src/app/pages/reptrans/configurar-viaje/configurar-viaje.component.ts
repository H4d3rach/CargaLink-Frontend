import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { modeloOferta } from '../../../servicios/ofertas/modeloOferta';
import { TransportistaService } from '../../../servicios/transportistas/transportista.service';
import { VehiculoService } from '../../../servicios/vehiculos/vehiculo.service';
import { SemirremolqueService } from '../../../servicios/semirremolques/semirremolque.service';
import { transSeguroModelo } from '../../../servicios/transportistas/transSeguroModelo';
import { modeloVehiculo } from '../../../servicios/vehiculos/modeloVehiculo';
import { modeloSemirremolque } from '../../../servicios/semirremolques/modeloSemirremolque';
import { modeloRecursos } from '../../../servicios/ofertas/modeloRecursos';
import { PostulacionService } from '../../../servicios/postulaciones/postulacion.service';
import { OfertaService } from '../../../servicios/ofertas/oferta.service';
import { ChatBService } from '../../../servicios/chatbot/chat-b.service';
type resource = transSeguroModelo | modeloVehiculo | modeloSemirremolque;
@Component({
  selector: 'app-configurar-viaje',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './configurar-viaje.component.html',
  styleUrl: './configurar-viaje.component.css'
})
export class ConfigurarViajeComponent implements OnInit{
  private _login = inject(LoginService);
  private _postulacion = inject(PostulacionService);
  private _oferta = inject(OfertaService);
  private _transportista = inject(TransportistaService);
  private _vehiculo = inject(VehiculoService);
  private _semirremolque = inject(SemirremolqueService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  oferta?: modeloOferta;
  idOferta: number = 0;
  isUserLogged: boolean = false;
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isTransTurn: boolean = true;
  isVehiculoTurn: boolean = false;
  isSemiTurn: boolean = false;
  transportistaList: transSeguroModelo[] = [];
  transportista?: transSeguroModelo
  vehiculosList: modeloVehiculo[] = [];
  vehiculo?: modeloVehiculo;
  semirremolqueList: modeloSemirremolque[] = [];
  semi?: modeloSemirremolque;
  recursosList: modeloRecursos[] = [];
  allResources: resource[] = [];
  isUnitary: boolean = false;
  isFinally: boolean = false;
  errorString: string = "";
  errorBool: boolean = false;
  errorLicencia: boolean = false;
  errorLicenciaString: string = "";
  pesoCarga: number | undefined = 0;
  pesoActual: number = 0;
  pesoSoportado: number = 0;
  private _chatbot = inject(ChatBService);
  preguntaChat: string = '';
  historialMensajesChatbot: {clase: string, msj: string}[] = [];
  constructor(private formBuilder: FormBuilder){
    this.idOferta = Number(this.route.snapshot.paramMap.get('idTrabajo'));
  }
  recursosForm = this.formBuilder.group({
    precioFinal: ['', [Validators.required]],
    contrato: ['', [Validators.required]],
    transportista: ['', [Validators.required]],
    vehiculo: ['', [Validators.required]],
    semirremolque: ['']
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
    this._transportista.getAllTrans().subscribe((transList)=>{
      this.transportistaList = transList;
      this.transportistaList =  this.transportistaList.filter(trans => trans.estatusTransportista != 'EN_VIAJE');
    });
    this._vehiculo.getAllVehiculos().subscribe((vehiculos)=>{
      this.vehiculosList = vehiculos;
      this.vehiculosList = this.vehiculosList.filter(vehiculo => vehiculo.estatus != 'EN_VIAJE');
    });
    this._semirremolque.getAllSemirremolque().subscribe((semirremolques)=>{
      this.semirremolqueList = semirremolques;
      this.semirremolqueList = this.semirremolqueList.filter(semi => semi.estatus != 'EN_VIAJE');
    });
    this._oferta.seeOfertaDetailsRepTrans(this.idOferta).subscribe((oferta)=>{
      this.pesoCarga = oferta.pesoTotal;
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
  onChange(event: any) { //Metodo que ayuda a obtener el valor del select tipo de carga y ayuda a desplegar el formulario para cada tipo
    const selectedValue = event.target.value;
    this.transportista = this.transportistaList.find( trans=> trans.idUsuario === selectedValue)
  }
  onChangeV(event: any) { //Metodo que ayuda a obtener el valor del select tipo de carga y ayuda a desplegar el formulario para cada tipo
    const selectedValue = event.target.value;
    this.vehiculo = this.vehiculosList.find( vehiculo => vehiculo.placa === selectedValue);
  }
  onChangeS(event: any) { //Metodo que ayuda a obtener el valor del select tipo de carga y ayuda a desplegar el formulario para cada tipo
    const selectedValue = event.target.value;
    console.log(selectedValue)
    this.semi = this.semirremolqueList.find( semirre => Number(semirre.idSemirremolque) === Number(selectedValue));
  }

  isVehiculo(recurso: any): recurso is modeloVehiculo {
    return (recurso as modeloVehiculo).placa !== undefined;  // La propiedad 'placa' es única de 'modeloVehiculo'
  }
  
  isTransportista(recurso: any): recurso is transSeguroModelo {
    return (recurso as transSeguroModelo).idUsuario !== undefined;  // La propiedad 'idUsuario' es única de 'transSeguroModelo'
  }
  
  isSemirremolque(recurso: any): recurso is modeloSemirremolque {
    return (recurso as modeloSemirremolque).idSemirremolque !== undefined;  // La propiedad 'idSemirremolque' es única de 'modeloSemirremolque'
  }
  agregarTrans(){
    this.isTransTurn = false;
    this.isVehiculoTurn = true;
    if(this.transportista)
    this.allResources.push(this.transportista);
  }
  borrarRecursos(){
    this.allResources = [];
    this.recursosList = [];
    this.isTransTurn = true;
    this.isVehiculoTurn = false;
    this.isSemiTurn = false;
    this.isUnitary = false;
    this.isFinally = false;
    this.errorBool = false;
    this.errorString = "";
  }
  verificarLicenciaUni(): boolean{
    const licencia = this.transportista?.categoria;
    if(licencia == 'B'){
      this.errorLicenciaString = "El transportista no tiene la licencia adecuada";
      this.errorLicencia = true;
      this.allResources.splice(-2,2);
      this.isTransTurn = true;
      this.isVehiculoTurn = false;
      this.isSemiTurn = false;
      this.isUnitary = false;
      this.isFinally = false;
      this.errorBool = false;
      this.errorString = "";
      return true;
    }
    return false;
  }
  verificarLicenciaSemi(): boolean{
    const licencia = this.transportista?.categoria;
    if(licencia == 'C'){
      this.errorLicenciaString = "El transportista no tiene la licencia adecuada";
      this.errorLicencia = true;
      this.allResources.splice(-3,3);
      this.isTransTurn = true;
      this.isVehiculoTurn = false;
      this.isSemiTurn = false;
      this.isUnitary = false;
      this.isFinally = false;
      this.errorBool = false;
      this.errorString = "";
      return true;
    }
    return false;
  }
  verificarUnitario(): boolean{
    const ejes = this.vehiculo?.noEjes;
    const llantas = this.vehiculo?.noLlantas;
    const pesoTotal = (this.pesoCarga ?? 0) + (this.vehiculo?.peso ?? 0) - this.pesoSoportado;
    if((ejes??0)==2 && (llantas??0)<=6 && pesoTotal>19000){
      this.pesoSoportado = this.pesoSoportado + (19000-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)==3 && (llantas??0)<=8 && pesoTotal>24000){
      this.pesoSoportado = this.pesoSoportado + (24000-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)==3 && (llantas??0)<=10 && pesoTotal>27500){
      this.pesoSoportado = this.pesoSoportado + (27500-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)>3 || (llantas??0)>10){
      this.errorString = "Configuración no válida, cambia de recurso";
      this.errorString = "Configuración no válida, ingrese otros recursos";
      this.errorBool = true;
      this.allResources = [];
      this.recursosList = [];
      this.isTransTurn = true;
      this.isVehiculoTurn = false;
      this.isSemiTurn = false;
      this.isUnitary = false;
      this.isFinally = false;
      return true;
    }
    return false;
  }
  verificarSemi(): boolean{
    const ejes = this.vehiculo?.noEjes;
    const llantas = this.vehiculo?.noLlantas;
    const ejesSemi = this.semi?.noEjes;
    const llantassemi = this.semi?.noLlantas;
    const llantastotales = (llantas ?? 0) + (llantassemi ?? 0);
    const pesoTotal = (this.pesoCarga ?? 0) + (this.vehiculo?.peso ?? 0) + (this.semi?.peso ?? 0) - this.pesoSoportado;
    if((ejes??0)==2 && (ejesSemi??0)==1 && llantastotales <= 10 && pesoTotal>30000){
      this.pesoSoportado = this.pesoSoportado + (30000-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
    }
    else if((ejes??0)==2 && (ejesSemi??0)<=2 && llantastotales <= 14 && pesoTotal>38000){
      this.pesoSoportado = this.pesoSoportado + (38000-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)==3 && (ejesSemi??0)<=2 && llantastotales <= 18 && pesoTotal>46500){
      this.pesoSoportado = this.pesoSoportado + (46500-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)==3 && (ejesSemi??0)<=3 && llantastotales <= 22 && pesoTotal>54000){
      this.pesoSoportado = this.pesoSoportado + (54000-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)==2 && (ejesSemi??0)<=3 && llantastotales <= 18 && pesoTotal>45500){
      this.pesoSoportado = this.pesoSoportado + (45500-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if((ejes??0)==3 && (ejesSemi??0)==1 && llantastotales <= 14 && pesoTotal>38500){
      this.pesoSoportado = this.pesoSoportado + (38500-(this.vehiculo?.peso ?? 0))
      this.errorString = "Configuración no válida, cambia de recurso o agrega uno más";
      this.errorBool = true;
      return true;
    } else if ((ejes??0)>3 || (ejesSemi??0)>3 || llantastotales > 22 ){
      this.errorString = "Configuración no válida, ingrese otros recursos";
      this.errorBool = true;
      this.allResources = [];
      this.recursosList = [];
      this.isTransTurn = true;
      this.isVehiculoTurn = false;
      this.isSemiTurn = false;
      this.isUnitary = false;
      this.isFinally = false;
      return true;
    }
    return false;
  }
  publicarSemi(){
    if(this.recursosForm.valid){
    const recursosSemi: modeloRecursos = {
      vehiculo: {
        placa: this.vehiculo?.placa ?? '',
        tipo: this.vehiculo?.tipo ?? ''
      } ,
      transportista: {
        idUsuario: this.transportista?.idUsuario ?? ''
      },
      semirremolque: {
        idSemirremolque: this.semi?.idSemirremolque ?? 0
      }
    }
    if(this.verificarLicenciaSemi()==false){
      if(this.verificarSemi()==false){
        this.errorBool = false;
        this.errorString = "";
        this.errorLicencia = false;
        this.errorLicenciaString = "";
    this.recursosList?.push(recursosSemi);
    let contrato: File = this.recursosForm.get('contrato')?.value as unknown as File;;
    const precio = Number(this.recursosForm.get('precioFinal')?.value)
    if(contrato){
      
      this._postulacion.asignarRecursos(this.idOferta,{precio: precio},contrato,this.recursosList).subscribe({
        next: ()=>{
          console.log("Next")
        },
        error: (error)=>{
          console.log(error)
        },
        complete: ()=>{
          this.router.navigateByUrl('rep_trans/trabajos');
        }
      })
    }
  }
  }}else{
    this.recursosForm.markAllAsTouched();
  }}
  publicarUni(){
    if(this.recursosForm.valid){
    const recursosUni: modeloRecursos = {
      vehiculo: {
        placa: this.vehiculo?.placa ?? '',
        tipo: this.vehiculo?.tipo ?? ''
      } ,
      transportista: {
        idUsuario: this.transportista?.idUsuario ?? ''
      }
    }
    if(this.verificarLicenciaUni()==false){
    if(this.verificarUnitario()==false){
      this.errorBool = false;
    this.errorString = "";
    this.errorLicencia = false;
    this.errorLicenciaString = "";
    this.recursosList?.push(recursosUni);
    let contrato: File = this.recursosForm.get('contrato')?.value as unknown as File;;
    const precio = Number(this.recursosForm.get('precioFinal')?.value)
    if(contrato){
      this._postulacion.asignarRecursos(this.idOferta,{precio: precio},contrato,this.recursosList).subscribe({
        next: ()=>{
          console.log("Next")
        },
        error: (error)=>{
          console.log(error)
        },
        complete: ()=>{
          this.router.navigateByUrl('rep_trans/trabajos');
        }
      })
    }
  }
  }
  }else{
    this.recursosForm.markAllAsTouched();
  }
  }
  addOtherUni(){
    const recursosUni: modeloRecursos = {
      vehiculo: {
        placa: this.vehiculo?.placa ?? '',
        tipo: this.vehiculo?.tipo ?? ''
      } ,
      transportista: {
        idUsuario: this.transportista?.idUsuario ?? ''
      }
    }
    if(this.verificarLicenciaUni()==false){
      if(this.verificarUnitario()==false){
        this.errorBool = false;
        this.errorString = "";
        this.errorLicencia = false;
        this.errorLicenciaString = "";
    this.transportistaList = this.transportistaList.filter(trans => trans.idUsuario != this.transportista?.idUsuario);
    this.vehiculosList = this.vehiculosList.filter(vehicle => vehicle.placa != this.vehiculo?.placa);
    this.recursosList?.push(recursosUni);
    this.isTransTurn = true;
    this.isVehiculoTurn = false;
    this.isSemiTurn = false;
    this.isUnitary = false;
    this.transportista = undefined;
    this.vehiculo = undefined;
    this.semi = undefined;
  }
}
  }
  addOtherSemi(){
    const recursosSemi: modeloRecursos = {
      vehiculo: {
        placa: this.vehiculo?.placa ?? '',
        tipo: this.vehiculo?.tipo ?? ''
      } ,
      transportista: {
        idUsuario: this.transportista?.idUsuario ?? ''
      },
      semirremolque: {
        idSemirremolque: this.semi?.idSemirremolque ?? 0
      }
    }
    if(this.verificarLicenciaSemi()==false){
      if(this.verificarSemi()==false){
        this.errorBool = false;
        this.errorString = "";
        this.errorLicencia = false;
        this.errorLicenciaString = "";
    this.transportistaList = this.transportistaList.filter(trans => trans.idUsuario != this.transportista?.idUsuario);
    this.vehiculosList = this.vehiculosList.filter(vehicle => vehicle.placa != this.vehiculo?.placa);
    this.semirremolqueList = this.semirremolqueList.filter(semi  => semi.idSemirremolque != this.semi?.idSemirremolque);
    this.recursosList?.push(recursosSemi);
    this.isTransTurn = true;
    this.isVehiculoTurn = false;
    this.isSemiTurn = false;
    this.isFinally = false;
    this.transportista = undefined;
    this.vehiculo = undefined;
    this.semi = undefined;
  } }}
  agregarVehiculo(){
    
    if(this.vehiculo){
      this.allResources.push(this.vehiculo);
      if(this.vehiculo.tipo == 'CAMION_UNITARIO'){
        this.isUnitary = true;
        this.isVehiculoTurn = true;
        this.isSemiTurn = false;
      }else{
        this.isVehiculoTurn = false;
        this.isSemiTurn = true;
      }
    }
  }
  agregarSemi(){
    this.isSemiTurn = false;
    this.isTransTurn = true;
    if(this.semi){
      this.allResources.push(this.semi);
      this.isFinally = true;
      this.isSemiTurn = true;
      this.isTransTurn = false;
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
  logout(){ //Metodo que nos ayuda a cerrar sesión
    localStorage.removeItem("chatMensajes");
    localStorage.removeItem("chatOpen");
    localStorage.removeItem("TipoEmpresa");
    this._login.logout();
    this.router.navigateByUrl('');
  }
  onFileSelect(event: any) { //Función que evita que al subir un archivo este se considere como inválido y agrega el valor al formulario
    const file = event.target.files[0];
    
    if (file) {
      this.recursosForm.patchValue({
        contrato: file 
      });
      this.recursosForm.get('contrato')?.updateValueAndValidity(); // Actualizar la validez del campo
    }
    
  }
  get precioF(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.recursosForm.controls.precioFinal;
  }
  get contract(){
    return this.recursosForm.controls.contrato;
  }
  get transporter(){
    return this.recursosForm.controls.transportista;
  }
  get car(){
    return this.recursosForm.controls.vehiculo;
  }
  get traila(){
    return this.recursosForm.controls.semirremolque;
  }

}