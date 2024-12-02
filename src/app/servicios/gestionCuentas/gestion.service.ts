import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloUpdateTrans, transSeguroModelo } from '../transportistas/transSeguroModelo';
import { modeloUsuario, updEmpresa, updRepresentante } from '../chats/modeloMensaje';

@Injectable({
  providedIn: 'root'
})
export class GestionService {
  private _http = inject(HttpClient);
  constructor() { }
  getTransInfo(id: string): Observable<transSeguroModelo>{
    return this._http.get<transSeguroModelo>(`http://localhost:8082/transportista/profile/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  updTrans(trans: modeloUpdateTrans): Observable<any>{
    return this._http.put<any>('http://localhost:8082/transportista/gestion', trans).pipe(
      catchError(this.manejadorErrores)
    )
  }
  getRepTrans():Observable<modeloUsuario>{
    return this._http.get<modeloUsuario>('http://localhost:8082/representante/transporte/detalles').pipe(
      catchError(this.manejadorErrores)
    )
  }
  updRepTrans(body: updRepresentante):Observable<any>{
    return this._http.put<any>('http://localhost:8082/representante/transporte/modificar',body).pipe(
      catchError(this.manejadorErrores)
    )
  }
  updEmpTrans(body: updEmpresa):Observable<any>{
    return this._http.put<any>('http://localhost:8082/representante/transporte/modificar/empresa',body).pipe(
      catchError(this.manejadorErrores)
    )
  }
  getRepCli(): Observable<modeloUsuario>{
    return this._http.get<modeloUsuario>('http://localhost:8082/representante/cliente/detalles').pipe(
      catchError(this.manejadorErrores)
    )
  }
  updRepCli(body: updRepresentante):Observable<any>{
    return this._http.put<any>('http://localhost:8082/representante/cliente/modificar',body).pipe(
      catchError(this.manejadorErrores)
    )
  }
  updEmpCli(body: updEmpresa):Observable<any>{
    return this._http.put<any>('http://localhost:8082/representante/cliente/modificar/empresa',body).pipe(
      catchError(this.manejadorErrores)
    )
  }
  manejadorErrores(error:HttpErrorResponse){ //Metodo que ayuda a manejar los errores
    if(error.status === 0){
      console.error('No se ha enviado el codigo del error', error.error);
    }
    else{
      console.error('Código de estado', error.status, error.error);
    }
    return throwError(()=> new Error('El registro es incorrecto'));
  }
}
