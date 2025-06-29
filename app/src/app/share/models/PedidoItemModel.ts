import { PedidoModel } from "./PedidoModel";
import { ProductoModel } from "./ProductoModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";
import { VarianteProductoModel } from "./VarianteProductoModel";

export interface PedidoItemModel {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  producto_personalizado_id?: number;
  id_variante_producto?: number;
  pedido: PedidoModel;
  producto: ProductoModel;
  producto_personalizado?: ProductoPersonalizableModel;
  variante_seleccionada?: VarianteProductoModel;
}
