export interface modeloRegTrans {
    idUsuario:         string;
    nombre:            string;
    primerApellido:    string;
    segundoApellido:   string;
    correo:            string;
    password:          string;
    telefono:          string;
    empresaTransporte: EmpresaTransporte;
}

export interface EmpresaTransporte {
    razonSocial:     string;
    descripcion:     string;
    nombreComercial: string;
    rfc:             string;
    direccion:       string;
    logo:            string;
    documentoFiscal: string;
}
