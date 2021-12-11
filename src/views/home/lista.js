import React from "react";
import PedidoListItem from "../../components/pedidoListItem";
import { usePedidos } from "../../context/pedidos";
import { Estilo } from "./listaStyle";

export default function Lista() {
  const { pedidos, setPedidos } = usePedidos();
  return (
        <Estilo>
          {pedidos ? pedidos.map(pedido => 
            (<PedidoListItem key={pedido.id} pedido={pedido} />)
          ):(<div></div>)}
        </Estilo>
  );
}
