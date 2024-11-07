import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroTransporteService } from '../../servicios/registro/registro-transporte.service';
@Component({
  selector: 'app-e-transporte-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './e-transporte-registro.component.html',
  styleUrl: './e-transporte-registro.component.css'
})
export class ETransporteRegistroComponent implements OnInit{
  private _registro = inject(RegistroTransporteService);
  private router = inject(Router);
  
  etransForm = this.formBuilder.group({ //Se crea el formulario de login, así se maneja en Angular con un formBuilder
    razonSocial: ['', [Validators.required]],  
    descripcion: ['', [Validators.required]], 
    nombreComercial: ['', [Validators.required]], 
    rfc: ['', [Validators.required, Validators.pattern('^[A-ZÑ]{3,4}\\d{6}[A-Z0-9]{3}$')]], 
    direccion: ['', [Validators.required]],
    logo: ['', [Validators.required]],
    documentoFiscal: ['', [Validators.required]],
  })
  constructor(private formBuilder: FormBuilder){ //Forma de inyectar el formBuilder de acuerdo a la documentación
    this.router.events.subscribe((event) =>{
      if(event instanceof NavigationEnd){
        window.scrollTo(0,0)
      }
    }    )
  }

  ngOnInit(): void {
    
  }
  registroParcial(){ //Función para guardar la información de la empresa y nos dirige a la vista del registro del usuario
    if(this.etransForm.valid){ //Confirmación de que el formulario tenga la información válida
      const formData = new FormData(); //Variable que guardará la información obtenida en el formulario
      formData.append('razonSocial', this.etransForm.get('razonSocial')?.value || '');
      formData.append('nombreComercial', this.etransForm.get('nombreComercial')?.value || '');
      formData.append('rfc', this.etransForm.get('rfc')?.value || '');
      formData.append('descripcion', this.etransForm.get('descripcion')?.value || '');
      formData.append('direccion', this.etransForm.get('direccion')?.value || '');
      const docfisc = this.etransForm.get('documentoFiscal')?.value as unknown as File; //Transforma el valor del documento a un archivo
      if (docfisc){
        //formData.append('documentoFiscal', docfisc);
        formData.append('documentoFiscal', 'cadenaPrueba');
      }
      const logo =  this.etransForm.get('logo')?.value as unknown as File; //Transforma el valor del logo a un archivo
      if(logo){
        //formData.append('logo', logo);
        console.log(logo)
        formData.append('logo', 'PruebaCadena2');
      }
        /*formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });*/
      this._registro.setEmpresa(formData); //Se guarda la información de la empresa
      this._registro.setKindEmpresa("TRANSPORTE"); //Se agrega el tipo de empresa TRANSPORTE
      this.router.navigateByUrl('usuario_registro'); //Se redirige a el registro del usuario
    }
    else{
      this.etransForm.markAllAsTouched(); //Nos muestra las alertas o fallos de cada input del formulario
    }
  }
  
  get razonSocial(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.razonSocial;
  }
  get descripcion(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.descripcion;
  }
  get nombreComercial(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.nombreComercial;
  }
  get rfc(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.rfc;
  }
  get direccion(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.direccion;
  }
  get logo(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.logo;
  }
  get documentoFiscal(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.etransForm.controls.documentoFiscal;
  }

  onFileSelect(event: any) { //Función que evita que al subir un archivo este se considere como inválido y agrega el valor al formulario
    const file = event.target.files[0];
    
    if (file) {
      this.etransForm.patchValue({
        documentoFiscal: file 
      });
      this.etransForm.get('documentoFiscal')?.updateValueAndValidity(); // Actualizar la validez del campo
    }
    
  }
  onLogoSelect(event: any) { //Función que evita que al subir un archivo este se considere como inválido y agrega el valor al formulario
    const file = event.target.files[0];
    if (file) {
      this.etransForm.patchValue({
        logo: file
      });
      this.etransForm.get('logo')?.updateValueAndValidity();
    }
  }
  
}
