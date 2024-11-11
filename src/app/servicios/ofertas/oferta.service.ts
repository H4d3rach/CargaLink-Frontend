import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { modeloOferta } from './modeloOferta';
import { catchError, concatAll, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private _http = inject(HttpClient); //Inyeccion del HTTP Client
  constructor() { }
  createOferta(oferta: modeloOferta): Observable<any>{ //Conexion con el ednpoint del backend para crear una oferta
    return this._http.post<any>('http://localhost:8082/representante/cliente/oferta',oferta).pipe(
      catchError(this.manejadorErrores)
    )
  }
  viewAllOfertas(): Observable<modeloOferta[]>{ //Conexion con el endpoint del backend que nos devolverá todos los registros de la tabla ofertas
    return this._http.get<modeloOferta[]>('http://localhost:8082/representante/transporte/oferta').pipe(
      catchError(this.manejadorErrores)
    )
  }
  viewMyOfertas(): Observable<modeloOferta[]>{
    return this._http.get<modeloOferta[]>('http://localhost:8082/representante/cliente/oferta').pipe(
      catchError(this.manejadorErrores)
    )
  }
  seeOfertaDetails(id: number): Observable<modeloOferta>{
    return this._http.get<modeloOferta>(`http://localhost:8082/representante/cliente/oferta/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  seeOfertaDetailsRepTrans(id: number): Observable<modeloOferta>{
    return this._http.get<modeloOferta>(`http://localhost:8082/representante/cliente/oferta/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  deleteOferta(id: number): Observable<any>{
    return this._http.delete(`http://localhost:8082/representante/transporte/oferta/${id}`).pipe(
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
