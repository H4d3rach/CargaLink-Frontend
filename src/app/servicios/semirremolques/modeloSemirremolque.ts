export interface modeloSemirremolque {
    idSemirremolque?: number;
    nombreIdentificador: string;
    estatus: string;
    tipo: string;
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
    noEjes: number;
    noLlantas: number;
    sede : sede;
}

export interface sede{
    idSede?: number
    nombre?: string
}