import { modeloRegCli } from "../registro/modeloRegCli";
import { modeloRegTrans } from "../registro/modeloRegTrans";

export interface modeloMensaje{
    idMensaje?: number;
    usuario?: modeloUsuario;
    idChat?: Number;
    contenido?: String;
    fecha?: Date;
}

export interface modeloUsuario{
    idUsuario: string; 
    nombre?: string; 
    primerApellido?: string; 
    segundoApellido?: string; 
    correo?: string; 
    telefono?: string; 
    rol?: string;
    empresaTransporte?: empresaModelo;
    empresaCliente?: empresaModelo;
}
export interface empresaModelo{
    razonSocial: string;
    descripcion: string;
    nombreComercial: string;
    rfc: string;
    direccion: string;
    logo: string;
}
export interface updRepresentante{
    nombre?: string; 
    primerApellido?: string; 
    segundoApellido?: string; 
    correo?: string; 
    telefono?: string; 
    password?: string;
    newpass?: string;
}
export interface updEmpresa{
    nombreComercial?: string;
    rfc?: string;
    direccion?: string;
    descripcion?: string;
    password?: string;
}