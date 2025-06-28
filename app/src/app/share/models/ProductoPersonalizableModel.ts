import { CategoriaModel } from "./CategoriaModel";
import { PedidoItemModel } from "./PedidoItemModel";
import { ProductoModel } from "./ProductoModel";
import { VarianteProductoModel } from "./VarianteProductoModel";

export interface ProductoPersonalizableModel {
  id: number;
  nombre: string;
  descripcion_general: string;
  id_categoria: number;
  id_producto_base: number;
  activo: boolean;
  categoria: CategoriaModel;
  producto_base: ProductoModel;
  variantes: VarianteProductoModel[];
  pedidoItems: PedidoItemModel[];
}
