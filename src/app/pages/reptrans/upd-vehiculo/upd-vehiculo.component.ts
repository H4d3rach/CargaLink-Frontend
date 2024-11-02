import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { VehiculoService } from '../../../servicios/vehiculos/vehiculo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { modeloSede } from '../../../servicios/sedes/modeloSede';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { modeloVehiculo } from '../../../servicios/vehiculos/modeloVehiculo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upd-vehiculo',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './upd-vehiculo.component.html',
  styleUrl: './upd-vehiculo.component.css'
})
export class UpdVehiculoComponent implements OnInit{
  private _login = inject(LoginService) //Inyeccion del servicio de login
  private _sede = inject(SedeService); //Inyeccion del servicio de sedes
  private _vehiculo = inject(VehiculoService); //Inyeccion del servicio de vehiculos
  private router = inject(Router) //Inyeccion del router
  private route = inject(ActivatedRoute) //Inyeccion del activated route
  isSidebarCollapsed: boolean = false; //Variables de control que nos ayudará a mostrar o no componentes en el html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isCUSelected: boolean = false;
  isUserLogged: boolean = false;
  errorVehiculo: string = ""; //Variables para obtener errores y mostrar alertas en el html
  errorBool: boolean = false;
  idVehiculo: string = ""; 
  sedeList: modeloSede[] = [];
  constructor(private formBuilder: FormBuilder){ //Inyeccion del formBuilder
    this.idVehiculo = String(this.route.snapshot.paramMap.get('placa')); //Obtencion de la placa del vehiculo por medio de la url
  }
  vehiculoForm = this.formBuilder.group( //Creacion del formulario
    {
      placa: ['',[Validators.required]],
      peso: [0,[Validators.required]],
      noEjes: [0,[Validators.required]],
      noLlantas: [0,[Validators.required]],
      largo: [0,[Validators.required]],
      marca: ['',[Validators.required]],
      tipo: ['',[Validators.required]],
      estatus: ['',[Validators.required]],
      modelo: ['',[Validators.required]],
      sede : [0,[Validators.required]],
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
    })

    this._vehiculo.getVehiculo(this.idVehiculo).subscribe({ //Suscripcion que nos ayudará a obtener el vehiculo a modificar
      next:(vehiculo)=>{
        this.vehiculoForm.patchValue({
          placa: vehiculo.placa,
          peso: vehiculo.peso,
          noEjes: vehiculo.noEjes,
          noLlantas: vehiculo.noLlantas,
          largo: vehiculo.largo,
          marca: vehiculo.marca,
          tipo: vehiculo.tipo,
          estatus: vehiculo.estatus,
          modelo: vehiculo.modelo,
          sede: vehiculo.sede.idSede,
          tipoCamion: vehiculo.tipoCamion
        });
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    });
  }
  actualizarVehiculo(){ //Metodo que nos ayudará a actualizar la info del vehiculo, usa el metodo declarado en el servicio del vehiculo
    if(this.vehiculoForm.valid){ //Se comunica con el backend solo cuando los datos del formulario son válidos
      let body = {} //A continuación se construiran los bodys request para los vehiculos que pueden ser unitarios o tractos
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
      this._vehiculo.updateVehiculo(body as modeloVehiculo).subscribe({ //Ocupa el servicio del vehiculo, el cual si todo sale bien, retorna null en caso de exito
        next: () => {
          console.log("Vehiculo creado");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorVehiculo = errorData;
        },
        complete: () => { //Una vez que se obtiene el token
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
  onChange(event: any) { //Obtiene los valores seleccionados en un select del html
    const selectedValue = event.target.value;
    this.isCUSelected = selectedValue === 'CAMION_UNITARIO';
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  seleccionCU(){ //Si se selecciona un camión unitario
    this.isCUSelected = !this.isCUSelected;
  }
  logout(){ //Funcion para cerrar sesión
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
  get tipoCamion(){ //Nos ayuda a obtener el control del input del tipo de camion para Llamarlo desde el html
    return this.vehiculoForm.controls.tipoCamion;
  }
}
