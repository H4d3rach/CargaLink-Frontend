export interface modeloRegCli {
    idUsuario:         string;
    nombre:            string;
    primerApellido:    string;
    segundoApellido:   string;
    correo:            string;
    password?:          string;
    telefono:          string;
    empresaCliente: EmpresaCliente;
}

export interface EmpresaCliente {
    razonSocial:     string;
    descripcion:     string;
    nombreComercial: string;
    rfc:             string;
    direccion:       string;
    logo:            string;
}
