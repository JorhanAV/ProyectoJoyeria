import { PedidoItemModel } from "./PedidoItemModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";
import { VarianteDetalleModel } from "./VarianteDetalleModel";

export interface VarianteProductoModel {
  id_variante: number;
  id_producto: number;
  sku: string;
  precio_final: number;
  stock: number;
  imagen_variante: string | null;
  producto: ProductoPersonalizableModel;
  detalles: VarianteDetalleModel[];
  pedidoItems: PedidoItemModel[];
}







