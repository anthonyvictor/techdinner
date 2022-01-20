import React from "react";
import PedidoListItem from "../../components/pedidoListItem";
import { usePedidos } from "../../context/pedidosContext";
import { Estilo } from "./listaStyle";

export default function Lista() {
  const { pedidos } = usePedidos();
  return (
        <Estilo>
          {pedidos ? pedidos.map(pedido => 
            (<PedidoListItem key={pedido.id} pedido={pedido} />)
          ):(<div></div>)}
        </Estilo>
  );
}
