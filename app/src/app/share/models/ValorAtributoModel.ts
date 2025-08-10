import { AtributoModel } from "./AtributoModel";
import { VarianteDetalleModel } from "./VarianteDetalleModel";

export interface ValorAtributoModel {
  id: number;
  id_atributo: number;
  valor: string;
  precio_extra: number;
  imagen: string;
  atributo: AtributoModel;
  varianteDetalles: VarianteDetalleModel[];
}
