import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { modeloMensaje } from './modeloMensaje';
import { modeloChat } from './modeloChat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _http = inject(HttpClient);
  private stompClient: any;
  messageSubject: BehaviorSubject<modeloMensaje[]> = new BehaviorSubject<modeloMensaje[]>([]);
  messageStream = this.messageSubject.asObservable();

  constructor() { }
  getChat(idUsuario : string): Observable<modeloChat>{
    return this._http.get<modeloChat>(`http://localhost:8082/api/chats/chat/${idUsuario}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  getAllMyChats(): Observable<modeloChat[]>{
    return this._http.get<modeloChat[]>('http://localhost:8082/api/chats/myChat').pipe(
      catchError(this.manejadorErrores)
    )
  }
  getMessages(idChat: number): Observable<modeloMensaje[]>{
    return this._http.get<modeloMensaje[]>(`http://localhost:8082/api/chats/mensajes/${idChat}`).pipe(
      catchError(this.manejadorErrores)
    )
  }
  loadMessages(idChat: number){
    this.getMessages(idChat).subscribe({
      next: (messages: modeloMensaje[])=>{
        this.messageSubject.next(messages);
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
  initConectionSocket(){ //Conexion para el socket
    const url = '//localhost:8082/socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    this.stompClient.reconnect_delay = 1000;
  }
  unirseChat(idChat: number){
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe(`/broker/${idChat}`, (messages: any)=>{
        const messageContent = JSON.parse(messages.body);
        const currentMessage =  this.messageSubject.getValue();
        currentMessage.push(messageContent);
        this.messageSubject.next(currentMessage);
      });
    }
  );
    this.loadMessages(idChat)
  }
  enviarMensaje(idChat: number, mensaje: string, userId: string){
    const body = JSON.stringify({
      contenido: mensaje,
      usuario: {
        idUsuario: userId
      }
    })
    this.stompClient.send(`/app/${idChat}`, {}, body)
  }
  getMessageSubject(): Observable<modeloMensaje[]> { return this.messageSubject.asObservable(); }

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
