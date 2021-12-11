import React from "react";
import { usePedidos } from "../../context/pedidos";
import { formatReal } from "../../util/Format";

export default function Rodape() {

    const {pedidos, setPedidos} = usePedidos()

    function getTotal(){
        let total = 0

        pedidos.map((pedido) => {
            total = total + pedido.valor
        })
        return formatReal(total)
    }

  return (
    <div>
      <div className="geral">
        <span>Pedidos: {pedidos.length}</span>
        <span className="adm"> | Total: {getTotal()}</span>
      </div>
      <div className="detalhes"></div>
    </div>
  );
}
