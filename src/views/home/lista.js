import React from "react";
import PedidoListItem from "../../components/pedidoListItem";
import { usePedidos } from "../../context/pedidos";

export default function Lista() {
  const { pedidos, setPedidos } = usePedidos();
  return (
    <div>
      {pedidos && (
        <ul>
          {pedidos.map(pedido => 
            (<PedidoListItem key={pedido.id} pedido={pedido} />)
          )}
        </ul>
      )}
    </div>
  );
}
