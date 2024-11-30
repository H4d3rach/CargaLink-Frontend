import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';
import { GestionService } from '../../../servicios/gestionCuentas/gestion.service';
import { modeloUpdateTrans, transSeguroModelo } from '../../../servicios/transportistas/transSeguroModelo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-trans-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './trans-config.component.html',
  styleUrl: './trans-config.component.css'
})
export class TransConfigComponent implements OnInit{
  private _login = inject(LoginService);
  private router = inject(Router);
  private _gestion = inject(GestionService);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  cambiarPassword: boolean = false;
  isUserLogged: boolean = false;
  myId: string = '';
  myInfo?: transSeguroModelo;
  ok: boolean = false;
  error: boolean = false;
  constructor(private formBuilder: FormBuilder){
    const userInfo = JSON.parse(String(sessionStorage.getItem('UserInfo')))
    this.myId = userInfo.idUsuario;
  }
  formUpdateCel = this.formBuilder.group({
    telefono: [''],
    password: ['', [Validators.required]]
  });
  formChangePassword = this.formBuilder.group({
    newPass: ['',[Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['',[Validators.required]]
  },{ validators: [this.passwordMatch('newPass', 'confirmPassword'), this.passwordComplex('newPass')]})
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
    this._gestion.getTransInfo(this.myId).subscribe((userData)=>{
      this.myInfo = userData;
      this.formUpdateCel.patchValue({
        telefono: userData.telefono
      });
    })
  }
  updateInfo(){
    if(this.formUpdateCel.valid){
    const cel = this.formUpdateCel.get('telefono')?.value ;
    const contra = this.formUpdateCel.get('password')?.value;
    if(cel && contra){
    let body: modeloUpdateTrans = {
      telefono: cel,
      verifyPass: contra
    }
    this._gestion.updTrans(body).subscribe({
      next: ()=>{
        this.ok = true
        this.error = false;
      },
      error: (error)=>{
        this.error = true;
        this.ok = false;
      }
    })
  }
  } else{
    this.formUpdateCel.markAllAsTouched();
  }
  }
  changePassword(){
    if(this.formChangePassword.valid){
      const newPass = this.formChangePassword.get('newPass')?.value;
      const pass = this.formChangePassword.get('password')?.value;
      let body: modeloUpdateTrans = {
        verifyPass : pass,
        password : newPass
      }
      this._gestion.updTrans(body).subscribe({
        next: ()=>{
          this.ok = true;
          this.error = false;
          this.formChangePassword.reset();
        },
        error: ()=>{
          this.error = true;
          this.ok = false;
        }
      })
    }else{
      this.formChangePassword.markAllAsTouched();
    }
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  togglePassword(){
    this.cambiarPassword = !this.cambiarPassword;
    this.ok = false;
    this.error = false;
  }
  togglePrincipal(){
    this.cambiarPassword = false;
    this.ok = false;
    this.error = false;
  }
  formatText(text: string | undefined): string { //Metodo que ayuda a  darle formato a respuestas que lo requieran
    if(text){
    return text
      .toLowerCase()
      .replace(/_/g,' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    }else{
      return "";
    }
  }

  logout(){
    this._login.logout();
    this.router.navigateByUrl('');
  }

  get updPass(){
    return this.formUpdateCel.controls.password
  }

  get confirmPassword(){
    return this.formChangePassword.controls['confirmPassword'];
  }

  get changePass(){
    return this.formChangePassword.controls['password'];
  }

  get changeNewPass(){
    return this.formChangePassword.controls['newPass']
  }
}
