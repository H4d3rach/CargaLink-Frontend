import { modeloRegCli } from "../registro/modeloRegCli";

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
    descripcion: string;
    lugarInicio: string;
    horaInicio?: string; //Checar
    lugarDestino: string;
    horaTermino?: string; //Checar
    precio: number;
    fechaInicio?: string; //Checar
    fechaFin?: string; //Checar
    contrato?: string; //Checar
    estatus?: string;
    pesoTotal: number;
    cargas: Carga[];
    representanteCliente: modeloRegCli;  
  }
  