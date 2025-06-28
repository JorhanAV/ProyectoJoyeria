import { PedidoModel } from "./PedidoModel";
import { PromocionModel } from "./PromocionModel";

export interface HistorialPromocionAplicadaModel {
  id: number;
  promocion_id: number;
  pedido_id: number;
  fecha: Date;
  promocion: PromocionModel;
  pedido: PedidoModel;
}
