import { AtributoModel } from "./AtributoModel";
import { VarianteDetalleModel } from "./VarianteDetalleModel";

export interface ValorAtributoModel {
  id_valor: number;
  id_atributo: number;
  valor: string;
  precio_extra: number;
  atributo: AtributoModel;
  varianteDetalles: VarianteDetalleModel[];
}
