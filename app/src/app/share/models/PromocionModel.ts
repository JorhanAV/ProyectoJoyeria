import { CategoriaModel } from "./CategoriaModel";
import { HistorialPromocionAplicadaModel } from "./HistorialPromocionAplicadaModel";
import { ProductoModel } from "./ProductoModel";

export interface PromocionModel {
  id: number;
  nombre: string;
  tipo: string;
  referencia_id_producto: number | null;
  referencia_id_categoria: number | null;
  valor: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  producto: ProductoModel | null;
  categoria: CategoriaModel | null;
  historial: HistorialPromocionAplicadaModel[];
  esPorProducto?: boolean;
  esPorCategoria?: boolean;
}