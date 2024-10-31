import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorErrorService implements HttpInterceptor{
  //Clase de interceptor para obtener los errores si se tienen al momento de concatenarle los headers con el interceptor-service
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error =>{
        console.error(error);
        return throwError(()=> error)
      })
    )
  }
}
