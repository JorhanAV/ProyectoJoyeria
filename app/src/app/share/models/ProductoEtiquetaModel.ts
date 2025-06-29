import { EtiquetaModel } from "./EtiquetaModel";
import { ProductoModel } from "./ProductoModel";

export interface ProductoEtiquetaModel {
  producto_id: number;
  etiqueta_id: number;
  producto: ProductoModel;
  etiqueta: EtiquetaModel;
}








