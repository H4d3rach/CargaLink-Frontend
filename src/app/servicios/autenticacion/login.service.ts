import { inject, Injectable } from '@angular/core';
import { modeloLogin } from './modeloLogin';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { modeloToken } from './modeloToken';
import { modeloSesion } from '../../servicios/autenticacion/modeloSesion';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _http = inject(HttpClient); //Inyeccioon del servicio HTTPCLIENT
  
  isUserLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); //Variable que nos dirá si el usuario está logueado o no
  userInfo: BehaviorSubject<string> = new BehaviorSubject<string>(""); //Variable que guardará el token

  constructor(){ //Si ya hay una sesion activada una vez que se mande a llamar, solo actualiza los datos
    this.isUserLogged = new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null); 
    this.userInfo = new BehaviorSubject<string>(sessionStorage.getItem("token") || "");
  }
  login(credenciales: modeloLogin):Observable<string>{ //Metodo que se comunica con el endpoint del backend para autentificarse
    return this._http.post<modeloToken>('http://localhost:8082/auth/login',credenciales).pipe(//Hacemos la petición post, le pasamos comoparametros las credenciales y lo encadenamos en una pipe
      tap((userData) => { //El metodo posto nos devolverá un objeto tipo modeloToken, que contiene la estructura {'token': 'ey5425424...'}
        sessionStorage.setItem("token", userData.token); //Se guarda el token en el session storage
        sessionStorage.setItem("UserInfo",JSON.stringify(this.decodificarToken(userData.token))); //Guardamos el token decodificado en el session storage
        this.userInfo.next(userData.token); //A los observables definidos anteriormente les añadimos la información
        this.isUserLogged.next(true);
      }),
      map((userData)=> userData.token), //Si hay errores los devolvemos
      catchError(this.manejadorErrores)
    )
  }
  reestablecerPassMail(email: string): Observable<any>{
    let body = {
      email: email
    }
    return this._http.post<any>('http://localhost:8082/auth/reset-password-mail',body).pipe(
      catchError(this.manejadorErrores)
    )
  }
  resetPass(token: string, pass: string): Observable<any>{
    let reset = {
      token: token,
      password: pass
    }
    return this._http.post<any>('http://localhost:8082/auth/reset-password',reset).pipe(
      catchError(this.manejadorErrores)
    )
  }
  getUserInfo(){ //Metodo que nos devuelve la información decodificada del token que se guardó previamente en el session storage
    const userinfo = sessionStorage.getItem("UserInfo");
    return userinfo ? JSON.parse(userinfo) : null;
  }
  logout(){ //Metodo que nos ayuda a cerrar sesión, elimina los datos del sessionStorage
    sessionStorage.removeItem("token");
    this.isUserLogged.next(false);
    sessionStorage.removeItem("UserInfo");
  }

  manejadorErrores(error:HttpErrorResponse){ //Metodo que ayuda a manejar los errores
    if(error.status === 0){
      console.error('No se ha enviado el codigo del error', error.error);
    }
    else{
      console.error('Código de estado', error.status, error.error);
    }
    return throwError(()=> new Error('Ingreso incorrecto vuelva a intentar'));
  }

  get userData(): Observable<String>{ //Ayuda a crear los observables del Behaviour subject
    return this.userInfo.asObservable();
  }
  get ifisUserLogged(): Observable<boolean>{
    return this.isUserLogged.asObservable();
  }
  getUserToken():string{
    return this.userInfo.value;
  }
  decodificarToken(token: string): modeloSesion | null{ //Función que decodifica el token jwt
    try {
      return jwtDecode<modeloSesion>(token); //Ayuda a retornar el token en formato modeloSesion que es diseñada por nosotros
    } catch (error) {
      console.error("Error decodificando el token", error)
      return null;
    }
  }

}
