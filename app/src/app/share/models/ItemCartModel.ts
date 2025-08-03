import { ProductoModel } from "./ProductoModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";

export interface ItemCartModel {
  producto: ProductoModel,
  producto_personalizado_id: ProductoPersonalizableModel
  cantidad: number;
  subtotal: number;
}
