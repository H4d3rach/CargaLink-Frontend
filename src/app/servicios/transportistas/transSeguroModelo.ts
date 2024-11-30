export interface transSeguroModelo{
    idUsuario:            string;
    nombre:               string;
    primerApellido:       string;
    segundoApellido:      string;
    correo:               string;
    telefono:             string;
    experiencia:          number;
    categoria:            string;
    estatusTransportista: string;
    sede: sede;
}
export interface sede{
    idSede?: number
    nombre?: string
}
export interface modeloUpdateTrans{
    password?: string;
    verifyPass: string;
    telefono?: string;
    estatusTransportista?: string;
}