import { AtributoModel } from "./AtributoModel";
import { ValorAtributoModel } from "./ValorAtributoModel";
import { VarianteProductoModel } from "./VarianteProductoModel";

export interface VarianteDetalleModel {
  id_variante: number;
  id_atributo: number;
  id_valor: number;
  variante: VarianteProductoModel;
  atributo: AtributoModel;
  valor: ValorAtributoModel;
}
