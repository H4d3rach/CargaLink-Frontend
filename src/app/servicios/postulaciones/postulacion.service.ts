import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, concatAll, Observable, throwError } from 'rxjs';
import { modeloPostulcion } from './modeloPostulacion';
import { modeloRepTrans } from './modeloRepTrans';
import { modeloRecursos } from '../ofertas/modeloRecursos';

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
  viewAllPostulaciones(id: number): Observable<modeloPostulcion[]>{
    return this._http.get<modeloPostulcion[]>(`http://localhost:8082/representante/cliente/postulacion/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  aceptarPostulacion(postulacion: modeloPostulcion): Observable<any>{
    return this._http.patch<any>('http://localhost:8082/representante/cliente/postulacion', postulacion).pipe(
      catchError(this.manejadorErrores)
    )
  }
  deletePostulacion(id: number): Observable<any>{
    return this._http.delete<any>(`http://localhost:8082/representante/transporte/postulacion/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  viewDetallesRepTrans(id: string): Observable<modeloRepTrans>{
    return this._http.get<modeloRepTrans>(`http://localhost:8082/representante/cliente/detalles/RepTrans/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  asignarRecursos(id: number, precio: number,file: File, listRecursos: modeloRecursos[]): Observable<any>{
    const formData = new FormData()
      formData.append('recursos', JSON.stringify(listRecursos));
      formData.append('precio', precio.toString());
      formData.append('file', file);
      console.log(formData.get('recursos'));
      console.log(formData.get('precio'))
      console.log(formData.get('file'))
    return this._http.post<any>(`http://localhost:8082/representante/transporte/recurso/${id}`, formData).pipe(
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
