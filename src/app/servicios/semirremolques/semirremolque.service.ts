import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloSemirremolque } from './modeloSemirremolque';

@Injectable({
  providedIn: 'root'
})
export class SemirremolqueService {
  private _http = inject(HttpClient); //Inyeccion del HTTPClient
  constructor() { }
  getAllSemirremolque(): Observable<modeloSemirremolque[]>{ //Metodo que nos permite listar todos los semirremolques que tenemos
   return this._http.get<modeloSemirremolque[]>('http://localhost:8082/representante/transporte/semirremolque').pipe(
    catchError(this.manejadorErrores)
   )
  }
  getSemi(id: number): Observable<modeloSemirremolque>{ //Metodo que nos permite obtener un semirremolque por id
    return this._http.get<modeloSemirremolque>(`http://localhost:8082/representante/transporte/semirremolque/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  createSemi(semirremolque: modeloSemirremolque): Observable<any>{ //Metodo que nos permite registrar un semirremolque
    return this._http.post<any>('http://localhost:8082/representante/transporte/semirremolque',semirremolque).pipe(
      catchError(this.manejadorErrores)
    )
  }
  delSemi(id: number): Observable<any>{ //Metodo que nos permite eliminar un semirremolque
    return this._http.delete<any>(`http://localhost:8082/representante/transporte/semirremolque/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  updateSemi(semi: modeloSemirremolque): Observable<any>{ //Metodo que nos permite actualizar un semirremolque
    return this._http.put<any>(`http://localhost:8082/representante/transporte/semirremolque/${semi.idSemirremolque}`, semi).pipe(
      catchError(this.manejadorErrores)
    )
  }
  manejadorErrores(error:HttpErrorResponse){ //Metodo que ayuda a manejar los errores
    if(error.status === 0){
      console.error('No se ha enviado el codigo del error', error);
    }
    else{
      console.error('Código de estado', error.status, error);
    }
    return throwError(()=> new Error('Ingreso incorrecto vuelva a intentar'));
  }
}
