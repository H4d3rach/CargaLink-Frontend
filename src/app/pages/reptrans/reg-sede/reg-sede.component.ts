import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { modeloSede } from '../../../servicios/sedes/modeloSede';

@Component({
  selector: 'app-reg-sede',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reg-sede.component.html',
  styleUrl: './reg-sede.component.css'
})
export class RegSedeComponent implements OnInit{
  private _login = inject(LoginService); //Inyección del servicio de login
  private _sede = inject(SedeService); //Inyeccion del servicio de sede
  private router = inject(Router); //Inyeccion del router
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  errorSede: string = "";
  errorBool: boolean = false;

  sedeForm = this.formBuilder.group({ //Creación del formulario de las sedes
    nombre: ['',[Validators.required, Validators.maxLength(45)]],
    direccion: ['',[Validators.required]]
  })
  
  constructor(private formBuilder: FormBuilder){

  }
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({ //Implementacion de la interfaz OnInit que es cuando se crea la clase
      next:(isUserLogged)=>{             //Esta suscripción a el servicio login nos ayudará a detectar que el usuario esté logueado
        this.isUserLogged =isUserLogged; //Si no es así se dirige a la ventana de login
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
  }

  registrarSede(){ //Funcion que nos ayuda a registrar la sede
    if(this.sedeForm.valid){ //Se procede unicamente si el formulario es válido
      this._sede.registro(this.sedeForm.value as modeloSede).subscribe({ //Se suscribe a la funcion de registrrar del servicio de sede
        next: ()=>{
          console.log("Sede registrada");
        },
        error: (errorData)=>{
          console.log(errorData);
          this.errorBool= true;
          this.errorSede = errorData;
        },
        complete: () =>{
          this.router.navigateByUrl('rep_trans/sedes');
        }
      })
    }
    else{
      this.sedeForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }

  logout(){ //Funcion que nos ayuda a cerrar sesión
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
