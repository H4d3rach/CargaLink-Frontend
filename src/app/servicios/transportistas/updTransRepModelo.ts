export interface updTransRepModelo{
    idUsuario:            string;
    experiencia:          number;
    categoria:            string;
    sede: sede;
}
export interface sede{
    idSede?: number
    nombre?: string
}