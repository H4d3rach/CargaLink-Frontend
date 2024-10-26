import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/autenticacion/login.service';
import { modeloLogin } from '../../servicios/autenticacion/modeloLogin';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  private _login = inject(LoginService); //Se inyecta el servicio del Login, que nos ayuda con la autenticacion
  private router = inject(Router); //Se inyecta el router que nos ayuda a mostrar las distintas vistas
  tokenDecoded?: any;
  errorLogin: string = "";
  errorBool: boolean = false;
  loginForm = this.formBuilder.group({ //Se crea el formulario de login, así se maneja en Angular con un formBuilder
    correo: ['', [Validators.required, Validators.email]],  //Nos ayuda a que el input del correo se le ingresen datos válidos
    password: ['', [Validators.required]], //Se requiere si o si el password
  })
  
  constructor(private formBuilder: FormBuilder){ //Forma de inyectar el formBuilder de acuerdo a la documentación

  }
  ngOnInit(): void {
    this.tokenDecoded = this._login.getUserInfo();
          if(this.tokenDecoded){
          if (this.tokenDecoded?.rol=='REPRESENTANTE_CLIENTE') { //Dependiendo del rol, te redirige a la pagina principal de cada rol
            this.router.navigateByUrl('cliente');
          } else if(this.tokenDecoded?.rol=='REPRESENTANTE_TRANSPORTE'){
            this.router.navigateByUrl('rep_trans');
          } else if(this.tokenDecoded?.rol=='TRANSPORTISTA'){
            this.router.navigateByUrl('transportista');
          }else if(this.tokenDecoded?.rol=='ADMINISTRADOR'){
            this.router.navigateByUrl('admin');
          }}
  }
  iniciarSesion(){
    if(this.loginForm.valid){ //Se comunica con el backend solo cuando los datos del formulario son válidos
      console.log("Exito");
      this._login.login(this.loginForm.value as modeloLogin).subscribe({ //Ocupa el servicio del login, el cual si todo sale bien, retorna el token
        next: (token) => {
          console.log(token);
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorLogin = errorData;
        },
        complete: () => { //Una vez que se obtiene el token
          this.errorBool= false;
          this.tokenDecoded = this._login.getUserInfo();
          if(this.tokenDecoded){
          if (this.tokenDecoded?.rol=='REPRESENTANTE_CLIENTE') { //Dependiendo del rol, te redirige a la pagina principal de cada rol
            this.router.navigateByUrl('cliente');
          } else if(this.tokenDecoded?.rol=='REPRESENTANTE_TRANSPORTE'){
            this.router.navigateByUrl('rep_trans');
          } else if(this.tokenDecoded?.rol=='TRANSPORTISTA'){
            this.router.navigateByUrl('transportista');
          }else if(this.tokenDecoded?.rol=='ADMINISTRADOR'){
            this.router.navigateByUrl('admin');
          }}
          this.loginForm.reset();
        }
      })
      
    }
    else{
      this.loginForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
  }
  get correo(){ //Nos ayuda a obtener el control del input del correo para Llamarlo desde el html
    return this.loginForm.controls.correo;
  }
  get password(){ //Nos ayuda a obtener el control del input del password para Llamarlo desde el html
    return this.loginForm.controls.password;
  }

  

  
}
