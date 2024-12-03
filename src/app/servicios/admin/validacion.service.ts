import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloValidacion } from './validation';

@Injectable({
  providedIn: 'root'
})
export class ValidacionService {
  private _http = inject(HttpClient);
  constructor() { }
  verSolicitudes(): Observable<modeloValidacion[]>{
    return this._http.get<modeloValidacion[]>('http://localhost:8082/administrador/RepTrans').pipe(
      catchError(this.manejadorErrores)
    )
  }
  validarCuenta(idRepresentante: string): Observable<any>{
    let body = {
      estatus : "VALIDO"
    }
    return this._http.patch<any>(`http://localhost:8082/administrador/RepTrans/${idRepresentante}`, body).pipe(
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
