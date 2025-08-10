export interface ProductoPersonalizableCreateModel {
  id:number;
  nombre: string;
  descripcion_general: string;
  id_categoria: number;
  id_producto_base: number;
  precio_base: number;
  criterios?: {
    criterio: string;
    seleccion: string;
    precio_extra: number;
  }[];
}
