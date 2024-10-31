import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { modeloSede } from './modeloSede';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private _http = inject(HttpClient) //Inyección del HTTP CLIENT
  constructor() { }

  registro(datos: modeloSede): Observable<any>{ //Conexion con el BACKEND para registrar sedes, donde retorna un body vacio
    return this._http.post<any>('http://localhost:8082/representante/transporte/sede', datos).pipe(
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }

  getAllSedes(): Observable<modeloSede[]>{ //Conexion con el BACKEND para listar todas las sedes, donde retorna una lista de sedes
    return this._http.get<modeloSede[]>('http://localhost:8082/representante/transporte/sede').pipe(
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }
  deleteSede(id: number): Observable<any>{//Conexion con el BACKEND para eliminar una sede, donde retorna un body vacio
    return this._http.delete<any>(`http://localhost:8082/representante/transporte/sede/${id}`).pipe(
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }
  getSede(idSede: number): Observable<modeloSede>{//Conexion con el BACKEND para obtener una sede, donde retorna una sede modeloSede
    return this._http.get<modeloSede>(`http://localhost:8082/representante/transporte/sede/${idSede}`).pipe(
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }
  updateSede(sede: modeloSede): Observable<any>{//Conexion con el BACKEND para obtener una sede, donde retorna una sede modeloSede
    return this._http.put<any>(`http://localhost:8082/representante/transporte/sede/${sede.idSede}`, sede).pipe(
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
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
