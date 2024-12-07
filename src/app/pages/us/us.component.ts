import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-us',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './us.component.html',
  styleUrl: './us.component.css'
})
export class UsComponent {
  private router = inject(Router);
  constructor(){
    this.router.events.subscribe((event) =>{ //Suscripción para que cada que se cambie de pantalla se coloque en la parte superior
      if(event instanceof NavigationEnd){
        window.scrollTo(0,0)
      }
    }    )
  }
  gotoTerms(){
    this.router.navigateByUrl('terms');
  }
}
