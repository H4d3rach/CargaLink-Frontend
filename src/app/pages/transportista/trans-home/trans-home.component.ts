import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-trans-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trans-home.component.html',
  styleUrl: './trans-home.component.css'
})
export class TransHomeComponent implements OnInit{
  private _login = inject(LoginService);
  private router = inject(Router);
  isSidebarCollapsed: boolean = false;
  chatOpen: boolean = false;
  isCardOpen: boolean = false;
  isInTravel: boolean = true; //CHECAR!!!!!!!!!!!!!!
  isUserLogged: boolean = false;
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
  logout(){
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
