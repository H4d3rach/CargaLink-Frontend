import { modeloRegCli } from "../registro/modeloRegCli";
import { modeloRecursos } from "./modeloRecursos";

export interface Carga {
    idCarga?: number;      
    pesoTotal: number;
    tipo: string; 
  }
    
  export interface Embalaje extends Carga {
    tipoEmbalaje: string; 
    contenido: string;
    noUnidades: number;
    pesoUnitario: number;
    largo: number;
    ancho: number;
    alto: number;
  }
  
  export interface Suelta extends Carga {
    descripcion: string;
  }
  
  export interface Contenedor extends Carga {
    contenido: string;
    largo: number;
    ancho: number;
    alto: number;
  }
  
  
  export interface modeloOferta {
    descripcion?: string;
    lugarInicio?: string;
    horaInicio?: string; 
    lugarDestino?: string;
    horaTermino?: string; 
    precio?: number;
    fechaInicio?: string; 
    fechaFin?: string; 
    contrato?: string; 
    estatus?: string;
    pesoTotal?: number;
    cargas?: Carga[];
    representanteCliente?: modeloRegCli;  
    idOferta?: number;
    recursos?: modeloRecursos[];
  }
  
  export interface modeloCalificacion{
    puntualidad: number;
    estadoCarga: number;
    precio: number;
    atencion: number;
    comentario: string;
  }