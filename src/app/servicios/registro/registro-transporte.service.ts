import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
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
  logo?: File;
  pdf?: File;
  constructor() { } 
  
  registroTransporte(credenciales: modeloRegTrans, file: File, image: File):Observable<string>{ //Metodo que se comunica con el endpoint del backend para registrar usuario y empresa de transporte
    const formData =  new FormData();
    const repTrans = new Blob([JSON.stringify(credenciales)],{type:'application/json'});
    formData.append('representanteTransporte',repTrans);
    formData.append('file',file);
    formData.append('image',image);
    
    return this._http.post<modeloToken>('http://localhost:8082/auth/representante/transporte',formData).pipe(//Hacemos la petición post, le pasamos comoparametros las credenciales y lo encadenamos en una pipe
      map((userData)=> userData.token), //Mapeamos la respuesta del endpoint a una string que tendrá el token
      catchError(this.manejadorErrores)//Si hay errores los devolvemos
    )
  }

  registroCliente(credenciales: modeloRegCli, image: File):Observable<string>{ //Metodo que se comunica con el endpoint del backend para registrar usuario y empresa de transporte
    const formData =  new FormData();
    const repCli = new Blob([JSON.stringify(credenciales)],{type:'application/json'});
    formData.append('representanteCliente',repCli);
    formData.append('image',image);
    return this._http.post<modeloToken>('http://localhost:8082/auth/representante/cliente', formData).pipe( //Hacemos la petición post, le pasamos comoparametros las credenciales y lo encadenamos en una pipe
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
  
  setEmpresa(datosEmpresa: FormData, logo: File, pdf?: File){ //Guarda los datos de la empresa que se quiere registrar
    this.empresa = datosEmpresa;
    this.logo = logo;
    this.pdf = pdf;
  }
  getEmpresa():FormData | null{ //Obtiene los datos de la empresa registrada
    if(this.empresa){
      return this.empresa;
    }
    else{
      return null;
    }
  }
  getLogo():File | null{
    if(this.logo){
      return this.logo;
    }
    else{
      return null;
    }
  }
  getPdf(): File | null{
    if(this.pdf){
      return this.pdf;
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
