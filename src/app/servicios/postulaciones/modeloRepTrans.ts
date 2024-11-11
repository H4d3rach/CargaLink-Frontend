import { modeloRegTrans } from "../registro/modeloRegTrans";

export interface modeloRepTrans{
    representanteTransporte: modeloRegTrans;
    calificaciones : Calificaciones[];
}
export interface Calificaciones{
    idCalificacion: number;
    puntualidad: number;
    estadoCarga: number;
    precio: number;
    atencion: number;
    comentario: string;
    promedio: number;
}