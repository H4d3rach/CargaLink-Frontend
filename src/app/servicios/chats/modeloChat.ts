import { modeloUsuario } from "./modeloMensaje";

export interface modeloChat{
    idChat: number;
    usuario1: modeloUsuario;
    usuario2: modeloUsuario;
}