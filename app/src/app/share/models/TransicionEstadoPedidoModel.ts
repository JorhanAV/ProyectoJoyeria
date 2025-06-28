import { EstadoPedidoModel } from "./EstadoPedidoModel";
import { PedidoModel } from "./PedidoModel";
import { UsuarioModel } from "./UsuarioModel";

export interface TransicionEstadoPedidoModel {
  id: number;
  pedido_id: number;
  estado: EstadoPedidoModel;
  fecha_hora: Date;
  admin_id: number;
  pedido: PedidoModel;
  admin: UsuarioModel;
}
