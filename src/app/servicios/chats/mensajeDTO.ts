import { modeloUsuario } from "./modeloMensaje";

export interface mensajeDTO{
    contenido: string;
    usuario: modeloUsuario;
}