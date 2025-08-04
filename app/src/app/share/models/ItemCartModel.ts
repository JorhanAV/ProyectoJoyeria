import { ProductoModel } from "./ProductoModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";

export interface ItemCartModel {
  producto: ProductoModel,
  cantidad: number;
  subtotal: number;
}
