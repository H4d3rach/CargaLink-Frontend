import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../servicios/autenticacion/login.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent implements OnInit{
  private _login = inject(LoginService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router)
  token: string = '';
  resetForm = this.formBuilder.group({
    password: ['', [Validators.required]],
    confirmPassword: ['',[Validators.required]],
  },{ validators: [this.passwordMatch('password', 'confirmPassword'), this.passwordComplex('password')]})
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
    this.route.queryParams.subscribe(params => { this.token = params['token']; });
    console.log(this.token);
  }

  resetPass(){
    if(this.resetForm.valid){
      const pass = this.resetForm.get('password')?.value;
      this._login.resetPass(this.token, pass).subscribe({
        next: ()=>{
          this.router.navigateByUrl('login')
        },
        error: (error)=>{
          console.log(error);
        }
      })
    }else{
      this.resetForm.markAllAsTouched()
    }
  }
  get password(){ //Nos ayuda a obtener el control del input Llamarlo desde el html
    return this.resetForm.controls['password'];
  }
  get confirmPassword(){
    return this.resetForm.controls['confirmPassword'];
  }
}
