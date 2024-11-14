import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
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
type resource = transSeguroModelo | modeloVehiculo | modeloSemirremolque;
@Component({
  selector: 'app-configurar-viaje',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './configurar-viaje.component.html',
  styleUrl: './configurar-viaje.component.css'
})
export class ConfigurarViajeComponent implements OnInit{
  private _login = inject(LoginService);
  private _postulacion = inject(PostulacionService);
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
    })
    this._vehiculo.getAllVehiculos().subscribe((vehiculos)=>{
      this.vehiculosList = vehiculos;
      this.vehiculosList = this.vehiculosList.filter(vehiculo => vehiculo.estatus != 'EN_VIAJE');
    })
    this._semirremolque.getAllSemirremolque().subscribe((semirremolques)=>{
      this.semirremolqueList = semirremolques;
      this.semirremolqueList = this.semirremolqueList.filter(semi => semi.estatus != 'EN_VIAJE');
    })
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
    console.log(this.semirremolqueList)
    console.log(this.semi)
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

  publicarSemi(){
    if(this.recursosForm.valid){
    const recursosSemi: modeloRecursos = {
      vehiculo: {
        placa: this.vehiculo?.placa,
        tipo: this.vehiculo?.tipo
      } ,
      transportista: {
        idUsuario: this.transportista?.idUsuario
      },
      semirremolque: {
        idSemirremolque: this.semi?.idSemirremolque
      }
    }
    this.recursosList?.push(recursosSemi);
    let contrato: File = this.recursosForm.get('contrato')?.value as unknown as File;;
    const precio = Number(this.recursosForm.get('precioFinal')?.value)
    if(contrato){
      this._postulacion.asignarRecursos(this.idOferta,precio,contrato,this.recursosList).subscribe({
        next: ()=>{
          console.log("Next")
        },
        error: (error)=>{
          console.log(error)
        },
        complete: ()=>{
          console.log("Complete")
        }
      })
    }
  }else{
    this.recursosForm.markAllAsTouched();
  }
  }
  publicarUni(){
    if(this.recursosForm.valid){
    const recursosUni: modeloRecursos = {
      vehiculo: {
        placa: this.vehiculo?.placa,
        tipo: this.vehiculo?.tipo
      },
      transportista: {
        idUsuario: this.transportista?.idUsuario
      }
    }
    this.recursosList?.push(recursosUni);
    let contrato: File = this.recursosForm.get('contrato')?.value as unknown as File;;
    const precio = Number(this.recursosForm.get('precioFinal')?.value)
    if(contrato){
      this._postulacion.asignarRecursos(this.idOferta,precio,contrato,this.recursosList).subscribe({
        next: ()=>{
          console.log("Next")
        },
        error: (error)=>{
          console.log(error)
        },
        complete: ()=>{
          console.log("Complete")
        }
      })
    }

  }else{
    this.recursosForm.markAllAsTouched();
  }
  }
  addOtherUni(){
    const recursosUni: modeloRecursos = {
      vehiculo: this.vehiculo,
      transportista: this.transportista
    }
    this.recursosList?.push(recursosUni);
    this.isTransTurn = true;
    this.isVehiculoTurn = false;
    this.isSemiTurn = false;
    this.transportista = undefined;
    this.vehiculo = undefined;
    this.semi = undefined;
  }
  addOtherSemi(){
    const recursosSemi: modeloRecursos = {
      vehiculo: this.vehiculo,
      transportista: this.transportista,
      semirremolque: this.semi
    }
    this.recursosList?.push(recursosSemi);
    this.isTransTurn = true;
    this.isVehiculoTurn = false;
    this.isSemiTurn = false;
    this.transportista = undefined;
    this.vehiculo = undefined;
    this.semi = undefined;
  }
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
    console.log(this.isUnitary)
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
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  logout(){ //Metodo que nos ayuda a cerrar sesión
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
}
