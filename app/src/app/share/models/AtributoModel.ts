import { ValorAtributoModel } from "./ValorAtributoModel";
import { VarianteDetalleModel } from "./VarianteDetalleModel";

export interface AtributoModel {
  id: number;
  nombre: string;
  tipo: string;
  valores: ValorAtributoModel[];
  detalles: VarianteDetalleModel[];
}
