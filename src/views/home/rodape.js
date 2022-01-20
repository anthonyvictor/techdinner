import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { usePedidos } from "../../context/pedidosContext";
import { formatReal } from "../../util/Format";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { Estilo } from "./rodapeStyle";

export default function Rodape() {
  const { pedidos, setPedidos } = usePedidos();

  function getTotal() {
    let r = 0;

    pedidos.map((pedido) => {
      r = r + pedido.valor;
    });
    return r;
  }

  function getTaxas() {
    let r = 0;

    pedidos.map((pedido) => {
      r = r + pedido.taxaEntrega;
    });
    return r;
  }

  function getPago() {
    let r = 0;

    pedidos.map((pedido) => {
      r = r + pedido.valorPago;
    });
    return r;
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
