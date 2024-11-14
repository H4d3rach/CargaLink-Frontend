import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloMensaje } from './modeloMensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _http = inject(HttpClient);
  constructor() { }
  getChat(idUsuario : string): Observable<number>{
    return this._http.get<number>(`http://localhost:8082/api/chats/chat/${idUsuario}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  getMessages(idChat: number): Observable<modeloMensaje[]>{
    return this._http.get<modeloMensaje[]>(`http://localhost:8082/api/chats/mensajes/${idChat}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  mandarMensaje(mensaje: modeloMensaje): Observable<any>{
    return this._http.post<any>('http://localhost:8082/api/chats', mensaje).pipe(
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
