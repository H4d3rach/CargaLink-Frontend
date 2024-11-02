import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { modeloVehiculo } from './modeloVehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private _http = inject(HttpClient); //Inyeccion del HTTP Client que nos ayudará a realizar las peticiones
  constructor() { }

  getAllVehiculos():Observable<modeloVehiculo[]>{ //Método que nos ayudará a obtener una lista de todos los vehiculos existentes en la empresa
    return this._http.get<modeloVehiculo[]>('http://localhost:8082/representante/transporte/vehiculo').pipe( //Conección con el Backend
      catchError(this.manejadorErrores)//Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }

  crearVehiculo(vehiculo: modeloVehiculo): Observable<any>{//Metodo que nos ayudará a crear un nuevo vehículo
    return this._http.post<any>('http://localhost:8082/representante/transporte/vehiculo',vehiculo).pipe(//Coneccion con el backend
      catchError(this.manejadorErrores)//Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }

  deleteVehiculo(placa: string): Observable<any>{//Metodo que nos ayudará a eliminar un vehículo
    return this._http.delete<any>(`http://localhost:8082/representante/transporte/vehiculo/${placa}`).pipe(
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }

  getVehiculo(placa: string): Observable<modeloVehiculo>{ //Metodo que nos ayudará a obtener un vehiculo por su placa
    return this._http.get<modeloVehiculo>(`http://localhost:8082/representante/transporte/vehiculo/${placa}`).pipe( //Coneccion con el backend
      catchError(this.manejadorErrores) //Se encadena en una pipe una funcion para obtener los errores en caso de que haya
    )
  }

  updateVehiculo(vehiculo: modeloVehiculo): Observable<any>{ //Metodo que nos ayuda a actualizar la información de un vehículo
    return this._http.put<any>(`http://localhost:8082/representante/transporte/vehiculo/${vehiculo.placa}`,vehiculo).pipe(//Coneccion con el backend
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
