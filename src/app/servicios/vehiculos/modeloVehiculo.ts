export interface modeloVehiculo {
    placa: string;
    peso: number;
    noEjes: number;
    noLlantas: number;
    largo: number;
    marca: string;
    tipo: string;
    estatus: string;
    modelo: string;
    sede : sede;
    tipoCamion?: string; 
}

export interface sede{
    idSede?: number
    nombre?: string
}