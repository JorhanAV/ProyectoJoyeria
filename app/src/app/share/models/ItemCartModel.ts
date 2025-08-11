import { ProductoModel } from "./ProductoModel";
import { ProductoPersonalizableCreateModel } from "./ProductoPersonalizableDTO";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";

export interface ItemCartModel {
  producto?: ProductoModel; // opcional si es producto estándar
  productoPersonalizado?: ProductoPersonalizableCreateModel;
  cantidad: number;
  subtotal: number;
}

