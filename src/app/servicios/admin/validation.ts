export interface modeloValidacion{
    idUsuario: string; 
    nombre?: string; 
    primerApellido?: string; 
    segundoApellido?: string; 
    correo?: string; 
    telefono?: string; 
    rol?: string;
    empresaTransporte?: empresaModeloTransporte;
}
export interface empresaModeloTransporte{
    razonSocial: string;
    descripcion: string;
    nombreComercial: string;
    rfc: string;
    direccion: string;
    logo: string;
    documentoFiscal: string;
}