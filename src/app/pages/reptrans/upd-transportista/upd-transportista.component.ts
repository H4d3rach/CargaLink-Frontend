import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { TransportistaService } from '../../../servicios/transportistas/transportista.service';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { modeloSede } from '../../../servicios/sedes/modeloSede';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { transportistaModelo } from '../../../servicios/transportistas/transportistaModelo';
import { CommonModule } from '@angular/common';
import { updTransRepModelo } from '../../../servicios/transportistas/updTransRepModelo';

@Component({
  selector: 'app-upd-transportista',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './upd-transportista.component.html',
  styleUrl: './upd-transportista.component.css'
})
export class UpdTransportistaComponent implements OnInit {
  private _login= inject(LoginService); //Inyeccion del servicio del login
  private _transportista = inject(TransportistaService); //Inyeccion del servicio del transportista
  private _sede = inject(SedeService); //Inyeccion del servicio de la sede
  private router = inject(Router); //Inyeccion del router
  private route = inject(ActivatedRoute);
  isSidebarCollapsed: boolean = false; //Variables de control que se ocupan para desplegar distintos elementos html
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isUserLogged: boolean = false;
  errorBool: boolean = false;
  errorTrans: string = "";
  sedeList: modeloSede[] = [];
  idTrans: string | null = "";
  constructor(private formBuilder: FormBuilder){
    this.idTrans = this.route.snapshot.paramMap.get('id'); //Obtencion del id por medio de la url
  }
  transForm = this.formBuilder.group({ //Creacion del formulario
    idUsuario: ['',[Validators.required, Validators.pattern('^[A-ZÑ]{4}\\d{6}[A-Z0-9]{3}$')]],
    nombre: ['',[Validators.required]],
    primerApellido: ['',[Validators.required]],
    segundoApellido: ['',[Validators.required]],
    correo: ['',[Validators.required, Validators.email]],
    telefono: ['',[Validators.required, Validators.pattern('^[0-9]{10}')]],
    experiencia:[0,[Validators.required]],
    categoria: ['',[Validators.required]],
    sede:[0,[Validators.required]]
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
    this._transportista.getTrans(this.idTrans).subscribe({ //Suscripcion que nos ayudará a obtener la informacion del transportista actual
      next:(trans) =>{
        this.transForm.patchValue({
          idUsuario: trans.idUsuario,
          nombre: trans.nombre,
          primerApellido: trans.primerApellido,
          segundoApellido: trans.segundoApellido,
          correo: trans.correo,
          telefono: trans.telefono,
          experiencia:trans.experiencia,
          categoria: trans.categoria,
          sede: trans.sede.idSede
        })
      }
    })
  }

  updTrans(){
    if(this.transForm.valid){
      let body = { //Creacion del body request para actualizar
        idUsuario: this.transForm.get('idUsuario')?.value,
        experiencia:this.transForm.get('experiencia')?.value,
        categoria: this.transForm.get('categoria')?.value,
        sede:{
          idSede : this.transForm.get('sede')?.value
        }
      }
      this._transportista.updateTrans(body as updTransRepModelo).subscribe({ //Suscripcion con el servicio de transportista para actualizar
        next: () => { //Si es exitoso 
          console.log("Transportista modificado");
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorTrans = errorData;
        },
        complete: () => { //Una vez que se actualiza
          this.errorBool= false;
          this.router.navigateByUrl('rep_trans/transportistas'); //Se redirige
      
          this.transForm.reset();
        }
      })
    }else{
      this.transForm.markAllAsTouched();
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
  get telefono(){
    return this.transForm.controls['telefono'];
  }
  get experiencia(){
    return this.transForm.controls['experiencia'];
  }
  get categoria(){
    return this.transForm.controls['categoria'];
  }

  get sede(){
    return this.transForm.controls['sede'];
  }
}