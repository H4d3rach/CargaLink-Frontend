import { modeloOferta } from "../ofertas/modeloOferta";
import { modeloRegTrans } from "../registro/modeloRegTrans";

export interface modeloPostulcion{
    idPostulacion?: number;
    oferta: modeloOferta;
    representanteTransporte: modeloRegTrans;
    precioPreeliminar: number;
}