import React from "react";
import { usePedidos } from "../../context/pedidosContext";
import { formatReal } from "../../util/Format";
import { Estilo } from "./rodapeStyle";

export default function Rodape() {
  const { pedidos } = usePedidos();

  function getTotal() {
    return pedidos.reduce((a, b) => a + b.valor, 0)
  }

  function getTaxas() {
    return pedidos.reduce((a, b) => a + b.taxaEntrega, 0)
  }

  function getPago() {
    return pedidos.reduce((a, b) => a + b.valorPago, 0)
  }

  return (
    <Estilo>
      <div className="geral">
        <p>Pedidos: {pedidos.length}</p>
        <p className="adm"> | Total: {formatReal(getTotal())}</p>
      </div>
      <div className="detalhes">
        <p className="tx" title="Taxas de entrega">{formatReal(getTaxas())}</p>
        <p className="pg" title="Valor pago">{formatReal(getPago())}</p>
        <p className="pnd" title="Valor pendente">{formatReal(getTotal() - getPago())}</p>
      </div>
    </Estilo>
  );
}
