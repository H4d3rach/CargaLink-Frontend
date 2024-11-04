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
    lugarDestino: string;
    precio: number;
    pesoTotal: number;
    cargas: Carga[];  
  }
  