import { ProductoModel } from "./ProductoModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";

export interface ItemCartModel {
  producto?: ProductoModel; // opcional si es producto estándar
  productoPersonalizado?: {
    id: number;
    nombre: string;
    precio_base: number;
    criterios: {
      criterio: string;
      seleccion: string;
      precio_extra: number;
    }[];
  };
  cantidad: number;
  subtotal: number;
}

