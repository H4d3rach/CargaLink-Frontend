import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { TransportistaService } from '../../../servicios/transportistas/transportista.service';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { modeloSede } from '../../../servicios/sedes/modeloSede';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { transportistaModelo } from '../../../servicios/transportistas/transportistaModelo';

@Component({
  selector: 'app-reg-transportista',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reg-transportista.component.html',
  styleUrl: './reg-transportista.component.css'
})
export class RegTransportistaComponent implements OnInit {
  private _login= inject(LoginService); //Inyeccion del servicio del login
  private _transportista = inject(TransportistaService); //Inyeccion del servicio del transportista
  private _sede = inject(SedeService); //Inyeccion del servicio de la sede
  private router = inject(Router); //Inyeccion del router
  isSidebarCollapsed: boolean = false; //Variables de control que se ocupan para desplegar distintos elementos html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isSedeRegister: boolean = false;
  isUserLogged: boolean = false;
  errorBool: boolean = false;
  errorTrans: string = "";
  sedeList: modeloSede[] = [];
  constructor(private formBuilder: FormBuilder){}
  transForm = this.formBuilder.group({ //Creacioon del formulario
    idUsuario: ['',[Validators.required, Validators.pattern('^[A-ZÑ]{4}\\d{6}[A-Z0-9]{3}$')]],
    nombre: ['',[Validators.required]],
    primerApellido: ['',[Validators.required]],
    segundoApellido: ['',[Validators.required]],
    correo: ['',[Validators.required, Validators.email]],
    password:['',[Validators.required]],
    confirmPassword: ['',[Validators.required]],
    telefono: ['',[Validators.required, Validators.pattern('^[0-9]{10}')]],
    experiencia:['',[Validators.required, Validators.pattern('^([0-9]|[1-6][0-9]|7[0-5])$')]],
    categoria: ['',[Validators.required]],
    estatusTransportista:['',[Validators.required]],
    sede:['',[Validators.required]]
  },{ validators: this.passwordMatch('password', 'confirmPassword')})
  passwordMatch(password: string, confirmPassword: string) { //Detalle del validador para confirmar contraseñas
    return(formGroup: FormGroup)=>{
      const control = formGroup.controls[password]; //Contraseña original
      const validControl = formGroup.controls[confirmPassword]; //Contraseña que servirá para comparar
      if(control.value !== validControl.value){ //Se compara el valor de las contraseñas
        validControl.setErrors({passwordMatch:true}); //Si no se parecen agrega un error de tipo passwordMatch
      }else{
        validControl.setErrors(null); //En caso contrario no se agrega ningún error
      }
    }
  }
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
  }

  registrarTrans(){
    if(this.transForm.valid){
      let body = { //Creacion del body request para el registro del transportista obteniendo los valores del formulario
        idUsuario: this.transForm.get('idUsuario')?.value,
        nombre: this.transForm.get('nombre')?.value,
        primerApellido: this.transForm.get('primerApellido')?.value,
        segundoApellido: this.transForm.get('segundoApellido')?.value,
        correo: this.transForm.get('correo')?.value,
        password: this.transForm.get('password')?.value,
        telefono: this.transForm.get('telefono')?.value,
        experiencia:this.transForm.get('experiencia')?.value,
        categoria: this.transForm.get('categoria')?.value,
        estatusTransportista: this.transForm.get('estatusTransportista')?.value,
        sede:{
          idSede : this.transForm.get('sede')?.value
        }
      }
      this._transportista.createTrans(body as transportistaModelo).subscribe({ //Coneccion con el servicio para registrar un transportista
        next: () => { //Si es exitoso 
          console.log("Transportista registrado");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorTrans = errorData;
        },
        complete: () => { //Una vez que se registra el transportista
          this.errorBool= false;
          this.router.navigateByUrl('rep_trans/transportistas'); //Se redirige
      
          this.transForm.reset(); //Limpia el formulario
        }
      })
    }else{
      this.transForm.markAllAsTouched(); //Marca todo el formulario como tocado en caso de tener valores incorrectos
    }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  logout(){ //Funcion para cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
  //Metodos que ayudan a obtener el control de cada input del formulario
  get idUsuario(){
    return this.transForm.controls['idUsuario'];
  }
  get nombre(){
    return this.transForm.controls['nombre'];
  }
  get primerApellido(){
    return this.transForm.controls['primerApellido'];
  }
  get segundoApellido(){
    return this.transForm.controls['segundoApellido'];
  }
  get correo(){
    return this.transForm.controls['correo'];
  }
  get password(){
    return this.transForm.controls['password'];
  }
  get confirmPassword(){
    return this.transForm.controls['confirmPassword'];
  }
  get telefono(){
    return this.transForm.controls['telefono'];
  }
  get experiencia(){
    return this.transForm.controls['experiencia'];
  }
  get categoria(){
    return this.transForm.controls['categoria'];
  }
  get estatusTransportista(){
    return this.transForm.controls['estatusTransportista'];
  }
  get sede(){
    return this.transForm.controls['sede'];
  }
}
