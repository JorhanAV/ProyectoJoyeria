import { CategoriaModel } from "./CategoriaModel";
import { ImagenProductoModel } from "./ImagenProductoModel";
import { PedidoItemModel } from "./PedidoItemModel";
import { ProductoEtiquetaModel } from "./ProductoEtiquetaModel";
import { ProductoPersonalizableModel } from "./ProductoPersonalizableModel";
import { PromocionModel } from "./PromocionModel";
import { ResenaModel } from "./ResenaModel";

export interface ProductoModel {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock: number;
  categoria_id: number;
  promedio_valoracion: number;
  activo: boolean;
  personalizable: boolean;
  categoria: CategoriaModel;
  imagenes: ImagenProductoModel[];
  etiquetas: ProductoEtiquetaModel[];
  resenas: ResenaModel[];
  pedidoItems: PedidoItemModel[];
  promociones: PromocionModel[];
  productosPersonalizables: ProductoPersonalizableModel[];
  imagenActual?: string; // Para manejar la imagen actual en el frontend
  precioFinal?: number; // Para manejar el precio final con promociones
  tienePromocion?: boolean; // Para indicar si el producto tiene una promoción activa
}





