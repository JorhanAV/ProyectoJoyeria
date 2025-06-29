import { ProductoModel } from "./ProductoModel";
import { ReporteResenaModel } from "./ReporteResenaModel";
import { UsuarioModel } from "./UsuarioModel";

export interface ResenaModel {
  id: number;
  usuario_id: number;
  producto_id: number;
  comentario: string;
  valoracion: number;
  fecha: Date;
  visible: boolean;
  usuario: UsuarioModel;
  producto: ProductoModel;
  reportes: ReporteResenaModel[];
}












