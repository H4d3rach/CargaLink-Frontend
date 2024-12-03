import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloChatbot } from './modeloChatbot';

@Injectable({
  providedIn: 'root'
})
export class ChatBService {
  private _http = inject(HttpClient);
  constructor() { }
  usarChatbot(pregunta: string): Observable<modeloChatbot>{
    let body = {
      pregunta: pregunta
    }
    return this._http.post<modeloChatbot>('http://localhost:8082/usuario/chatbot',body).pipe(
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
