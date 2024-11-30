import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { GestionService } from '../../../servicios/gestionCuentas/gestion.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { modeloUsuario, updEmpresa, updRepresentante } from '../../../servicios/chats/modeloMensaje';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion-cuenta-reptrans',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './configuracion-cuenta-reptrans.component.html',
  styleUrl: './configuracion-cuenta-reptrans.component.css'
})
export class ConfiguracionCuentaReptransComponent implements OnInit{
  private _login = inject(LoginService);
  private _gestion = inject(GestionService);
  private router = inject(Router)
  private formBuilder = inject(FormBuilder);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  transferirCuenta: boolean = false;
  cambiarPassword: boolean = false;
  isUserLogged: boolean = false;
  myInfo?: modeloUsuario;
  ok: boolean = false;
  error: boolean = false;
  formEmpresa = this.formBuilder.group({
    nombreComercial: ['', [Validators.required]],
    rfc: ['', [Validators.required]],
    logo: [],
    direccion: ['',[Validators.required]],
    descripcion: ['',[Validators.required]],
    password: ['',[Validators.required]]
  })
  formUsuario = this.formBuilder.group({
    nombre: ['',[Validators.required]],
    primerApellido: ['', [Validators.required]],
    segundoApellido: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    password: ['',[Validators.required]]
  });
  formChangePassword = this.formBuilder.group({
    newPass: ['',[Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['',[Validators.required]]
  },{ validators: [this.passwordMatch('newPass', 'confirmPassword'), this.passwordComplex('newPass')]});
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
  passwordComplex(password: string){
    return(formGroup: FormGroup)=>{
      const control = formGroup.controls[password];
      const value = control.value || '';
      const errors: any = {};
      if (!/[A-Z]/.test(value)) {
        errors.sinMayuscula = 'Debe incluir al menos una letra mayúscula.';
    }
    if (!/[a-z]/.test(value)) {
        errors.sinMinuscula = 'Debe incluir al menos una letra minúscula.';
    }
    if (!/\d/.test(value)) {
        errors.sinNumero = 'Debe incluir al menos un número.';
    }
    if (value.length < 8) {
        errors.longitud = 'Debe tener al menos 8 caracteres.';
    }
    if(Object.keys(errors).length > 0){
      control.setErrors(errors);
    }
    else{
      control.setErrors(null);
    }
    }
  }
  ngOnInit(): void {
    this._login.ifisUserLogged.subscribe({
      next:(isUserLogged)=>{
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
    this._gestion.getRepTrans().subscribe((userData)=>{
      this.myInfo = userData;
      this.formEmpresa.patchValue({
        nombreComercial: userData.empresaTransporte?.nombreComercial,
        rfc: userData.empresaTransporte?.rfc,
        direccion: userData.empresaTransporte?.direccion,
        descripcion: userData.empresaTransporte?.descripcion
      });
      this.formUsuario.patchValue({
        nombre: userData.nombre,
        primerApellido: userData.primerApellido,
        segundoApellido: userData.segundoApellido,
        telefono: userData.telefono,
        correo: userData.correo
      })
    })
  }
  modificarUsuario(){
    if(this.formUsuario.valid){
      let body = {
        nombre : this.formUsuario.get('nombre')?.value,
        primerApellido : this.formUsuario.get('primerApellido')?.value,
        segundoApellido: this.formUsuario.get('segundoApellido')?.value,
        correo: this.formUsuario.get('correo')?.value,
        telefono: this.formUsuario.get('telefono')?.value,
        password: this.formUsuario.get('password')?.value
      }
      this._gestion.updRepTrans(body as updRepresentante).subscribe({
        next: ()=>{
          this.ok = true;
          this.error = false;
        },
        error: ()=>{
          this.ok = false;
          this.error = true;
        }
      })
    }else{
      this.formUsuario.markAllAsTouched()
    }
  }
  modificarEmpresa(){
    if(this.formEmpresa.valid){
      let body = {
        nombreComercial: this.formEmpresa.get('nombreComercial')?.value,
        rfc: this.formEmpresa.get('rfc')?.value,
        direccion: this.formEmpresa.get('direccion')?.value,
        descripcion: this.formEmpresa.get('descripcion')?.value,
        password: this.formEmpresa.get('password')?.value
      }
      this._gestion.updEmpTrans(body as updEmpresa).subscribe({
        next: ()=>{
          this.ok = true;
          this.error = false;
          this.formEmpresa.reset()
        },
        error: ()=>{
          this.ok = false;
          this.error = true;
        }
      })
    }else{
      this.formEmpresa.markAllAsTouched()
    }
  }
  modificarContra(){
    if(this.formChangePassword.valid){
      let body = {
        password: this.formChangePassword.get('password')?.value,
        newpass: this.formChangePassword.get('newPass')?.value
      }
      this._gestion.updRepTrans(body as updRepresentante).subscribe({
        next: ()=>{
          this.ok = true;
          this.error = false;
          this.formChangePassword.reset()
        },
        error: ()=>{
          this.ok = false;
          this.error = true;
        }
      })
    }else{
      this.formChangePassword.markAllAsTouched()
    }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  toggleCuenta(){
    this.transferirCuenta = !this.transferirCuenta;
    this.cambiarPassword = false;
    this.ok = false;
    this.error = false;
  }
  togglePassword(){
    this.cambiarPassword = !this.cambiarPassword;
    this.transferirCuenta = false;
    this.ok = false;
    this.error = false;
  }
  togglePrincipal(){
    this.cambiarPassword = false;
    this.transferirCuenta = false;
    this.ok = false;
    this.error = false;
  }
  logout(){
    this._login.logout();
    this.router.navigateByUrl('');
  }
  get nombreComercial (){
    return this.formEmpresa.controls.nombreComercial;
  }
  get rfc(){
    return this.formEmpresa.controls.rfc;
  }
  get logo(){
    return this.formEmpresa.controls.logo;
  }
  get direccion(){
    return this.formEmpresa.controls.direccion;
  }
  get descripcion(){
    return this.formEmpresa.controls.descripcion;
  }
  get empresaPassword(){
    return this.formEmpresa.controls.password;
  }
  get nombre(){
    return this.formUsuario.controls.nombre;
  }
  get primerApellido(){
    return this.formUsuario.controls.primerApellido;
  }
  get segundoApellido(){
    return this.formUsuario.controls.segundoApellido;
  }
  get telefono(){
    return this.formUsuario.controls.telefono;
  }
  get correo(){
    return this.formUsuario.controls.correo;
  }
  get userPassword(){
    return this.formUsuario.controls.password;
  }
  get newPass(){
    return this.formChangePassword.controls['newPass'];
  }
  get changePassword(){
    return this.formChangePassword.controls['password'];
  }
  get confirmPassword(){
    return this.formChangePassword.controls['confirmPassword'];
  }
}
