import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloPostulcion } from './modeloPostulacion';
import { modeloOferta } from '../ofertas/modeloOferta';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private _http = inject(HttpClient);
  constructor() { }
  createPostulacion(postulacion: modeloPostulcion): Observable<any>{
    return this._http.post('http://localhost:8082/representante/transporte/postulacion',postulacion).pipe(
      catchError(this.manejadorErrores)
    )
  }
  viewAlMyPostulaciones(): Observable<modeloPostulcion[]>{
    return this._http.get<modeloPostulcion[]>(`http://localhost:8082/representante/transporte/postulacion`).pipe(
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
