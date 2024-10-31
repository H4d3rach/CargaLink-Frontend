import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { modeloSede } from '../../../servicios/sedes/modeloSede';

@Component({
  selector: 'app-upd-sede',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './upd-sede.component.html',
  styleUrl: './upd-sede.component.css'
})
export class UpdSedeComponent implements OnInit{
  private _login = inject(LoginService); //Inyeccion del servicio de login
  private _sede = inject(SedeService); //Inyeccion del servicio de sede
  private router = inject(Router); //Inyeccion del router
  private route = inject(ActivatedRoute); //Inyeccion del route
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  errorSede: string = "";
  errorBool: boolean = false;
  idSede: number = 0; //Variable que guarda la id de la sede obtenida de la url
  sede?: modeloSede; //varaibale que guardará la información de la sede

  sedeForm = this.formBuilder.group({ //Creación del formulario de las sedes
    nombre: ['',[Validators.required]],
    direccion: ['',[Validators.required]]
  })
  
  constructor(private formBuilder: FormBuilder){
    this.idSede = Number(this.route.snapshot.paramMap.get('id')) //Obtenemos el id de la sede por medio de la URL
  }
  ngOnInit(): void { //Implementacion de la interfaz OnInit que es cuando se crea la clase
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
    //Dentro de OnInit se va a obtener la información de la sede para mostrarla en el formulario
    this._sede.getSede(this.idSede).subscribe({
      next:(sede)=>{
        this.sedeForm.patchValue(sede);
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    });
  }

  updateSede(){ //Metodo para actualizar la información de la sede una vez que la información del formulario sea actualizada
    if(this.sedeForm.valid){
    const sede_body = { //Se crea un objeto con la estructura que necesita el BACKEND, no lo obtenemos directamente del form.value
      idSede: this.idSede, //porque necesitamos agregar el id que es necesario para actualizar
      nombre: this.sedeForm.get('nombre')?.value,
      direccion: this.sedeForm.get('direccion')?.value
    }
    this._sede.updateSede(sede_body as modeloSede).subscribe({ //Suscripcion al servicio de sede para actualizar sede
      next: ()=>{
        console.log("Sede actualizada");
      },
      error: (errorData)=>{
        console.log(errorData);
        this.errorBool= true;
        this.errorSede = errorData;
      },
      complete: () =>{
        this.router.navigateByUrl('rep_trans/sedes');
      }
    });
  }
  else{
    this.sedeForm.markAllAsTouched();
  }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  
  logout(){ //Metodo que nos permite cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
  get nombre() { //nos ayuda a obtener el input del nombre del formulario
    return this.sedeForm.controls.nombre
  }

  get direccion(){ //Nos ayuda a obtener el input de la dirección del formulario
    return this.sedeForm.controls.direccion
  }
}
