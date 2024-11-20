import { modeloSemirremolque } from "../semirremolques/modeloSemirremolque";


export interface modeloRecursos{
    idRecurso?: number;
    vehiculo?: modeloVehiculoRecurso;
    transportista?: transSeguroModeloRecurso;
    semirremolque?: modeloSemirremolqueRecurso;
}
export interface modeloSemirremolqueRecurso {
    idSemirremolque: number;
    nombreIdentificador?: string;
    estatus?: string;
    tipo?: string;
    largo?: number;
    ancho?: number;
    alto?: number;
    peso?: number;
    noEjes?: number;
    noLlantas?: number;
    sede?: sede;
}
export interface transSeguroModeloRecurso{
    idUsuario?:            string;
    nombre?:               string;
    primerApellido?:       string;
    segundoApellido?:      string;
    correo?:               string;
    telefono?:             string;
    experiencia?:          number;
    categoria?:            string;
    estatusTransportista?: string;
    sede?: sede;
}
export interface modeloVehiculoRecurso {
    placa: string;
    peso?: number;
    noEjes?: number;
    noLlantas?: number;
    largo?: number;
    marca?: string;
    tipo?: string;
    estatus?: string;
    modelo?: string;
    sede? : sede;
    tipoCamion?: string; 
}

export interface sede{
    idSede?: number
    nombre?: string
}
