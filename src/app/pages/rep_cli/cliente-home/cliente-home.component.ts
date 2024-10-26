import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.css'
})
export class ClienteHomeComponent implements OnInit{
  isSidebarCollapsed: boolean = false;
  isEmbalaje: boolean = false;
  isSuelta: boolean = false;
  isContenedor: boolean =  false;
  chatOpen: boolean = false;
  isAgreeged: boolean = false;
  isSecondAgreeged: boolean = false;
  isUserLogged: boolean = false;

  private _login = inject(LoginService);
  private router = inject(Router);
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
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){
    this.chatOpen = !this.chatOpen;
  }
  onChange(event: any) {
    const selectedValue = event.target.value;
    
    this.isEmbalaje = selectedValue === 'Embalaje';
    this.isSuelta = selectedValue === 'Suelta';
    this.isContenedor = selectedValue === 'Contenedor';
  }
  agregarCarga(){
    this.isAgreeged = true;
    this.isSecondAgreeged = false;
  }
  publicarOferta(){
    this.isAgreeged = false;
  this.isSecondAgreeged  = false;
  }
  addOther(){
    this.isAgreeged = false;
    this.isSecondAgreeged = true;
  }
  regresar(){
    this.isAgreeged = true;
    this.isSecondAgreeged = false;
  }

  logout(){
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
