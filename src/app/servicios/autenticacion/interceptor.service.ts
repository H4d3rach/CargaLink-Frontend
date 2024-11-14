import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,HttpHeaders } from '@angular/common/http';
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
    let headers = req.headers;
    if(req.body instanceof FormData){
      req.body.forEach((value, key)=>{
        if (value instanceof File){
        }else{
          headers = headers.append(`Content-Type-${key}`,'application/json')
        }
      });
      if(token!=""){
        headers = headers.append('Authorization', `Bearer ${token}`)
      }
      const cloneReq = req.clone({headers})
      console.log("AQUI SALIENDO SI APARECE ALGO DESPUES LLAMA");
      console.log(cloneReq)
      return next.handle(cloneReq)
    }
    else if(token!=""){ //Si tenemos un token entonces procedemos a 
      headers = headers.set('Content-Type', 'application/json;charset=utf-8')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        
    }
    const cloneReq = req.clone({headers})
                        console.log(cloneReq)
                        return next.handle(cloneReq); //Se realiza la petición o request
    
  }
}
