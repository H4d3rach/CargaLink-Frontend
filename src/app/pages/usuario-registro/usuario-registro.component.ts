import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { RegistroTransporteService } from '../../servicios/registro/registro-transporte.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { modeloRegTrans } from '../../servicios/registro/modeloRegTrans';
import { modeloRegCli } from '../../servicios/registro/modeloRegCli';
@Component({
  selector: 'app-usuario-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './usuario-registro.component.html',
  styleUrl: './usuario-registro.component.css'
})
export class UsuarioRegistroComponent implements OnInit{
  private _registro = inject(RegistroTransporteService); //Inyeccion del servicio de registro
  private router = inject(Router); //Inyeccion del enrutador 
  formulario?: FormData | null; //Variable que servirá para obtener toda la información de la empresa
  errorLogin: string = "";
  errorBool: boolean = false;
  constructor(private formBuilder: FormBuilder){ //Forma de inyectar el formBuilder de acuerdo a la documentación
    this.router.events.subscribe((event) =>{ //Suscripción para que cada que se cambie de pantalla se coloque en la parte superior
      if(event instanceof NavigationEnd){
        window.scrollTo(0,0)
      }
    }    )
  }

  userForm = this.formBuilder.group({ //Se crea el formulario de login, así se maneja en Angular con un formBuilder
    idUsuario: ['', [Validators.required, Validators.pattern('^[A-ZÑ]{4}\\d{6}[A-Z0-9]{3}$')]],  
    nombre: ['', [Validators.required]], 
    primerApellido: ['', [Validators.required]], 
    segundoApellido: ['', [Validators.required]], 
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['',[Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}')]],
  },{ validators: this.passwordMatch('password', 'confirmPassword')}); //Validador creado para que coincidan las contraseñas

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

  
  registrar(){ //Función para registrar toda la información
    if(this.userForm.valid){ //Verifica que toda la información del formulario
      const kindEmpresa = this._registro.getKindEmpresa(); //Se obtiene el tipo de empresa (CLIENTE/TRANSPORTE)
//      console.log(kindEmpresa);
      if(kindEmpresa == 'TRANSPORTE'){ //Si la empresa es transporte se realiza todo lo necesario en cuanto a la estructura que pide el backend
      const bodyCombinado ={ //Estructura que se le pasará al backend
        idUsuario: this.userForm.get('idUsuario')?.value,
        nombre : this.userForm.get('nombre')?.value,
        primerApellido : this.userForm.get('primerApellido')?.value,
        segundoApellido: this.userForm.get('segundoApellido')?.value,
        correo: this.userForm.get('correo')?.value,
        password: this.userForm.get('password')?.value,
        telefono: this.userForm.get('telefono')?.value,
        empresaTransporte: {
          razonSocial: this.formulario?.get('razonSocial'),
          descripcion: this.formulario?.get('descripcion'),
          nombreComercial: this.formulario?.get('nombreComercial'),
          rfc: this.formulario?.get('rfc'),
          direccion: this.formulario?.get('direccion'),
          logo: this.formulario?.get('logo'),
          documentoFiscal: this.formulario?.get('documentoFiscal')
        }
      }
      this._registro.registroTransporte(bodyCombinado as modeloRegTrans).subscribe({ //Ocupa el servicio del registro con el metodo de registrar empresa y usaurio de transporte
        next: (token) => { //Si es exitoso retorna un token
          console.log(token);
        },
        error: (errorData) =>{ //Si se reciben errores, en esta directiva del observable se obtienen
          console.log(errorData);
          this.errorBool= true;
          this.errorLogin = errorData;
        },
        complete: () => { //Una vez que se obtiene el token
          this.errorBool= false;
          this._registro.delKindEmpresa();
          this.router.navigateByUrl('login'); //Se redirige al login
      
          this.userForm.reset();
        }
      })
      }
      else if(kindEmpresa == 'CLIENTE'){ //Funciona igual que la condición anterior pero para empresa/usuario cliente
        const bodyCombinado ={
          idUsuario: this.userForm.get('idUsuario')?.value,
          nombre : this.userForm.get('nombre')?.value,
          primerApellido : this.userForm.get('primerApellido')?.value,
          segundoApellido: this.userForm.get('segundoApellido')?.value,
          correo: this.userForm.get('correo')?.value,
          password: this.userForm.get('password')?.value,
          telefono: this.userForm.get('telefono')?.value,
          empresaCliente: {
            razonSocial: this.formulario?.get('razonSocial'),
            descripcion: this.formulario?.get('descripcion'),
            nombreComercial: this.formulario?.get('nombreComercial'),
            rfc: this.formulario?.get('rfc'),
            direccion: this.formulario?.get('direccion'),
            logo: this.formulario?.get('logo'),
          }
        }
        this._registro.registroCliente(bodyCombinado as modeloRegCli).subscribe({ //Ocupa el servicio de registro con el metodo de registrar cliente
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
            this._registro.delKindEmpresa();
            this.router.navigateByUrl('login');
            this.userForm.reset();
          }
        })
      }
    }else{
      this.userForm.markAllAsTouched();
    }
  }
  ngOnInit(): void { //Al inicializarse obtiene la información de la empresa
    this.formulario = this._registro.getEmpresa();
  }
  get idUsuario(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['idUsuario'];
  }
  get nombre(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['nombre'];
  }
  get primerApellido(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['primerApellido'];
  }
  get segundoApellido(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['segundoApellido'];
  }
  get correo(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['correo'];
  }
  get password(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['password'];
  }
  get confirmPassword(){
    return this.userForm.controls['confirmPassword'];
  }
  get telefono(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.userForm.controls['telefono'];
  }
}


