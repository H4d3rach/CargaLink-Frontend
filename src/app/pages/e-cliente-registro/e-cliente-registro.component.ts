import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroTransporteService } from '../../servicios/registro/registro-transporte.service';
@Component({
  selector: 'app-e-cliente-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './e-cliente-registro.component.html',
  styleUrl: './e-cliente-registro.component.css'
})
export class EClienteRegistroComponent {
  private _registro = inject(RegistroTransporteService); //Inyeccion del servicio para registrar
  private router = inject(Router); //Inyección del router

  
  ecliForm = this.formBuilder.group({ //Se crea el formulario de login, así se maneja en Angular con un formBuilder
    razonSocial: ['', [Validators.required]],  
    descripcion: ['', [Validators.required]], 
    nombreComercial: ['', [Validators.required]], 
    rfc: ['', [Validators.required,Validators.pattern('^[A-ZÑ]{3,4}\\d{6}[A-Z0-9]{3}$')]], 
    direccion: ['', [Validators.required]],
    logo: ['', [Validators.required]],
  })
  constructor(private formBuilder: FormBuilder){ //Forma de inyectar el formBuilder de acuerdo a la documentación
    this.router.events.subscribe((event) =>{ //Suscripción para que cada que se cambie de pantalla se coloque en la parte superior
      if(event instanceof NavigationEnd){
        window.scrollTo(0,0)
      }
    }    )
  }
  gotoTerms(){
    this.router.navigateByUrl('terms');
  }
  registroParcial(){ //Función para guardar la información de la empresa y nos dirige a la vista del registro del usuario
    if(this.ecliForm.valid){ //Confirmación de que el formulario tenga la información válida
      const formData = new FormData(); //Variable que guardará la información obtenida en el formulario
      formData.append('razonSocial', this.ecliForm.get('razonSocial')?.value || '');
      formData.append('nombreComercial', this.ecliForm.get('nombreComercial')?.value || '');
      formData.append('rfc', this.ecliForm.get('rfc')?.value || '');
      formData.append('descripcion', this.ecliForm.get('descripcion')?.value || '');
      formData.append('direccion', this.ecliForm.get('direccion')?.value || '');
      const logo =  this.ecliForm.get('logo')?.value as unknown as File; //Transforma el valor del logo a un archivo
      if(logo){
        this._registro.setEmpresa(formData,logo); //Se guarda la información de la empresa
        this._registro.setKindEmpresa("CLIENTE"); //Se agrega el tipo de empresa CLIENTE
        this.router.navigateByUrl('usuario_registro'); //Se redirige a el registro del usuario
      }
      
    }
    else{
      this.ecliForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
  }
  
  get razonSocial(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.ecliForm.controls.razonSocial;
  }
  get descripcion(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.ecliForm.controls.descripcion;
  }
  get nombreComercial(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.ecliForm.controls.nombreComercial;
  }
  get rfc(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.ecliForm.controls.rfc;
  }
  get direccion(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.ecliForm.controls.direccion;
  }
  get logo(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.ecliForm.controls.logo;
  }

  onLogoSelect(event: any) { //Función que evita que al subir un archivo este se considere como inválido y agrega el valor al formulario
    const file = event.target.files[0];
    if (file) {
      this.ecliForm.patchValue({
        logo: file
      });
      this.ecliForm.get('logo')?.updateValueAndValidity();
    }
  }

}
