import { ResenaModel } from "./ResenaModel";
import { UsuarioModel } from "./UsuarioModel";

export interface ReporteResenaModel {
  id: number;
  resena_id: number;
  usuario_id: number;
  comentario: string;
  resena: ResenaModel;
  usuario: UsuarioModel;
}