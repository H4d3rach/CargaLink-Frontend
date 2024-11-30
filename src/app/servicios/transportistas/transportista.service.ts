import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { transportistaModelo } from './transportistaModelo';
import { catchError, Observable, throwError } from 'rxjs';
import { transSeguroModelo } from './transSeguroModelo';
import { updTransRepModelo } from './updTransRepModelo';

@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  private _http = inject(HttpClient); //Inyeccion del HTTPClient
  constructor() { }

  getAllTrans(): Observable<transportistaModelo[]>{ //Metodo que ayuda a conectarse con el backend y obtiene todos los transportistas registrados en una empresa
    return this._http.get<transportistaModelo[]>('http://localhost:8082/representante/transporte/transportista').pipe(
      catchError(this.manejadorErrores)
    )
  }
  createTrans(transportista: transportistaModelo): Observable<any>{ //Metodo que se conecta con el backend para crear un transportista
    return this._http.post<any>('http://localhost:8082/representante/transporte/transportista', transportista).pipe(
      catchError(this.manejadorErrores)
    )
  }
  deleteTrans(id: string): Observable<any>{ //Metodo que se conecta con el backend para eliminar un transportista
    return this._http.delete<any>(`http://localhost:8082/representante/transporte/transportista/${id}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  updateTrans(transportista: updTransRepModelo): Observable<any>{ //Metodo que se comunica con el backend para actualizar los transportistas
    return this._http.put<any>(`http://localhost:8082/representante/transporte/transportista/${transportista.idUsuario}`, transportista).pipe(
      catchError(this.manejadorErrores)
    )
  }
  getTrans(idTrans: string| null): Observable<transSeguroModelo>{ //Metodo que se comunica con el backend para obtener un transportista
    return this._http.get<transSeguroModelo>(`http://localhost:8082/representante/transporte/transportista/${idTrans}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  changeEstatus(status: string): Observable<any>{
    const body = {
      estatusTransportista: status
    }
    return this._http.put<any>('http://localhost:8082/transportista/editar',body).pipe(
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
