import { PedidoModel } from "./PedidoModel";
import { ReporteResenaModel } from "./ReporteResenaModel";
import { ResenaModel } from "./ResenaModel";
import { RoleModel } from "./RolModel";
import { TransicionEstadoPedidoModel } from "./TransicionEstadoPedidoModel";

export interface UsuarioModel {
  id: number;
  nombre_usuario: string;
  correo: string;
  contraseña: string;
  rol: RoleModel;
  ultimo_inicio_sesion: Date;
  resenas: ResenaModel[];
  pedidos: PedidoModel[];
  transiciones_estado: TransicionEstadoPedidoModel[];
  reportes_resena: ReporteResenaModel[];
}











