import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../servicios/autenticacion/login.service';
import { SedeService } from '../../../servicios/sedes/sede.service';
import { modeloSede } from '../../../servicios/sedes/modeloSede';

@Component({
  selector: 'app-gestion-sede',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestion-sede.component.html',
  styleUrl: './gestion-sede.component.css'
})
export class GestionSedeComponent implements OnInit {
  private _login = inject(LoginService) //Inyección del servicio del login
  private _sede = inject(SedeService); //Inyeccion del servicio de sede
  private router = inject(Router); //Inyeccion del router
  isSidebarCollapsed: boolean = false; //Variables que nos ayudan al sidebar, header y el chat
  chatOpen: boolean = false;
  isUserLogged: boolean = false;
  sedeList: modeloSede[] = []; //Lista de todas las sedes
  constructor(){

  }
  ngOnInit(): void { //Implementacion de la interfaz OnInit que es cuando se crea la clase
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
    //Dentro de OnInit se van a listar todas las sedes con la siguiente suscripción
    this._sede.getAllSedes().subscribe((data: modeloSede[])=>{
      this.sedeList = data;
    })
  }
  //Funcion que nos ayuda a editar una sede seleccionada
  updateSede(id: number){
    this.router.navigate(['/rep_trans/sedes',id]);
  }
  //Función que nos ayuda a eliminar la sede seleccionada con la suscripcion al servicio de la sede
  deleteSede(id: number){
    this._sede.deleteSede(id).subscribe({
      next: () =>{
        console.log("Sede eliminada");

        this.sedeList = this.sedeList.filter(sede => sede.idSede != id); //Se elimina la sede de la lista local, para no mostrarla una vez que se elimina
      },
      error: (errorData) =>{
        console.log(errorData);
      }
    })
  }
  //Funcion para cambiar la sidebar a logos o que se vea el texto
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  funcionChat(){ //Funcion para abrir o cerrar el chatbot
    this.chatOpen = !this.chatOpen;
  }
  logout(){ //Funcion para cerrar sesión
    this._login.logout();
    this.router.navigateByUrl('');
  }
}
