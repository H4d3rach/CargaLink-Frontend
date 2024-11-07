import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor { //Interceptor que nos ayudará a anexarle headers a los requests hechos
  private _login = inject(LoginService) //Se inyecta el servicio de Login
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string = this._login.getUserToken(); //Se obtiene el token del usuario
    if(token!=""){ //Si tenemos un token entonces procedemos a 
      req=req.clone( //Clonar nuestro request
        {
          setHeaders:{ //Añadirle los siguientes headers para poder confirmar que el usuario está autenticado
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
    }
    //console.log(req)
    return next.handle(req); //Se realiza la petición o request
  }
}
