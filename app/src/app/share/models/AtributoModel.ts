import { ValorAtributoModel } from "./ValorAtributoModel";
import { VarianteDetalleModel } from "./VarianteDetalleModel";

export interface AtributoModel {
  id_atributo: number;
  nombre: string;
  tipo: string;
  valores: ValorAtributoModel[];
  detalles: VarianteDetalleModel[];
}
