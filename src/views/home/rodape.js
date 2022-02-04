import React from "react";
import { usePedidos } from "../../context/pedidosContext";
import { formatReal } from "../../util/Format";
import styled from "styled-components";
import * as misc from "../../util/misc";

export default function Rodape() {
  const { pedidos } = usePedidos();

  function getTotal() {
    return pedidos.reduce((a, b) => a + b.valor, 0)
  }

  function getTaxas() {
    const enderecos = pedidos.filter(e => !misc.isNEU(e.endereco)).map(e => e.endereco)
    const taxas = enderecos.filter(e => !misc.isNEU(e.taxa)).map(e => e.taxa).reduce((a,b) => a + b, 0)
    return taxas
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

const Estilo = styled.div`
height: 30px;
  border-top: 1px solid black;
  overflow: hidden;

    .geral {
      text-align: center;
      p {
        display: inline;
        font-weight: 600;
        line-height: 30px;
        user-select: none;
        pointer-events: none;
      }
    }

    .detalhes {
      opacity: 100%;
      display: flex;
      justify-content: space-around;

      p {
        line-height: 28px;
        user-select: none;
        font-size: 15px;

        &:hover {
          font-weight: 600;
          font-size: 17px;
          cursor: pointer;
        }
      }

      .tx {
        color: blue;
      }

      .pg {
        color: green;
      }

      .pnd {
        color: red;
      }
    }

    &:hover {
      .geral {
        opacity: 0;
        display: none;
      }
    }

    @media (max-width: 550px){
        .geral p {
        font-weight: 600;
        line-height: 36px;
      }

      .detalhes p{
          line-height: 36px;
      }

      &:hover {
      .geral {
        opacity: 100%;
        display: block;
      }
    }

    }

`;
