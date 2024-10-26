import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { modeloToken } from '../autenticacion/modeloToken';
import { modeloRegTrans } from './modeloRegTrans';
import { modeloRegCli } from './modeloRegCli';

@Injectable({
  providedIn: 'root'
})
export class RegistroTransporteService {
  private _http = inject(HttpClient); //Inyecta el servicio de HTTP CLIENT
  empresa?: FormData;
  constructor() { } 
  
  registroTransporte(credenciales: modeloRegTrans):Observable<string>{ //Metodo que se comunica con el endpoint del backend para registrar usuario y empresa de transporte
    return this._http.post<modeloToken>('http://localhost:8082/auth/representante/transporte',credenciales).pipe(//Hacemos la petición post, le pasamos comoparametros las credenciales y lo encadenamos en una pipe
      map((userData)=> userData.token), //Mapeamos la respuesta del endpoint a una string que tendrá el token
      catchError(this.manejadorErrores)//Si hay errores los devolvemos
    )
  }

  registroCliente(credenciales: modeloRegCli):Observable<string>{ //Metodo que se comunica con el endpoint del backend para registrar usuario y empresa de transporte
    return this._http.post<modeloToken>('http://localhost:8082/auth/representante/cliente', credenciales).pipe( //Hacemos la petición post, le pasamos comoparametros las credenciales y lo encadenamos en una pipe
      map((userData)=>userData.token), //Mapeamos la respuesta del endpoint a una string que tendrá el token
      catchError(this.manejadorErrores) //Si hay errores los devolvemos
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
  
  setEmpresa(datosEmpresa: FormData){ //Guarda los datos de la empresa que se quiere registrar
    this.empresa = datosEmpresa;
  }
  getEmpresa():FormData | null{ //Obtiene los datos de la empresa registrada
    if(this.empresa){
      return this.empresa;
    }
    else{
      return null;
    }
  }

  setKindEmpresa(tipo: string){ //Se guarda en el localstorage el tipo de empresa
    localStorage.setItem("TipoEmpresa",tipo);
  }
  getKindEmpresa(){ //Se obtiene del localstorage el tipo de empresa
    return localStorage.getItem("TipoEmpresa");
  }
  delKindEmpresa(){
    localStorage.removeItem("TipoEmpresa"); //Se elimina el tipo de empresa guardado
  }
}
