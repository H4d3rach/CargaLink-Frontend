import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
//Guard que nos servirá para proteger las rutas de accesos inapropiados
export const rutasGuard: CanActivateFn = (route, state) => {
  const _login = inject(LoginService); //Inyección de servicios
  const router =  inject(Router);
  
  const isUserLogged: boolean = _login.isUserLogged.getValue(); //Se verifica si el usuario está logueado
  const userInfo = sessionStorage.getItem("UserInfo");

  if (userInfo){ //Esta función sirve para comparar que el usuario con determinado rol solo acceda a las vistas definidas
  if(isUserLogged){
    const decodedToken = JSON.parse(userInfo);
    const rol = decodedToken?.rol;
    const rolEsperado = route.data['rol'];

    if(rol === rolEsperado){
      return true
    }
  }
 } 
    router.navigateByUrl('login'); //Si no está logueado se dirige a el login
    return false;
  
};
