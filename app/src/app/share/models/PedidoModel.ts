import { HistorialPromocionAplicadaModel } from "./HistorialPromocionAplicadaModel";
import { MetodoPagoModel } from "./MetodoPagoModel";
import { PedidoItemModel } from "./PedidoItemModel";
import { TransicionEstadoPedidoModel } from "./TransicionEstadoPedidoModel";
import { UsuarioModel } from "./UsuarioModel";

export interface PedidoModel {
  id: number;
  usuario_id: number;
  fecha_pedido: Date;
  direccion_envio: string;
  metodo_pago: MetodoPagoModel;
  subtotal: number;
  total: number;
  impuestos: number;
  estado_carrito: boolean;
  usuario: UsuarioModel;
  items: PedidoItemModel[];
  transiciones: TransicionEstadoPedidoModel[];
  promociones_aplicadas: HistorialPromocionAplicadaModel[];
}
