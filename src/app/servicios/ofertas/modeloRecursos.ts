import { modeloSemirremolque } from "../semirremolques/modeloSemirremolque";
import { transSeguroModelo } from "../transportistas/transSeguroModelo";
import { modeloVehiculo } from "../vehiculos/modeloVehiculo";
import { modeloOferta } from "./modeloOferta";

export interface modeloRecursos{
    idRecurso?: number;
    vehiculo?: {
        placa?: string;
        tipo?: string
    };
    transportista?: {
        idUsuario?: string
    };
    semirremolque?: {
        idSemirremolque?: number;
    };
}
