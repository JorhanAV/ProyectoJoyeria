import { ProductoPersonalizable } from "../../producto/producto-personalizable/producto-personalizable";
import { AtributoModel } from "./AtributoModel";
import { ValorAtributoModel } from "./ValorAtributoModel";
import { VarianteProductoModel } from "./VarianteProductoModel";

export interface VarianteDetalleModel {
  id: number;
  id_productoPersonalizable: number;
  id_valor: number;
  variante: VarianteProductoModel;
  productoPersonalizable: ProductoPersonalizable;
  valor: ValorAtributoModel;
}
