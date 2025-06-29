import { ProductoModel } from "./ProductoModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";
import { PromocionModel } from "./PromocionModel";

export interface CategoriaModel {
  id: number;
  nombre: string;
  descripcion: string;
  productos: ProductoModel[];
  promociones: PromocionModel[];
  productosPersonalizables: ProductoPersonalizableModel[];
}





