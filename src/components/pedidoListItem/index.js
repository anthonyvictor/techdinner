import React, { useState } from "react";
import { Estilo } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatReal } from "../../util/Format";

import {
  faClock,
  faHome,
  faMobile,
  faMoneyBillWaveAlt,
  faPrint,
  faQuestion,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";

export default function PedidoListItem(pedido) {
  pedido = pedido.pedido;


  const [duracao, setDuracao] = useState(getDuration())

  setInterval(function() {
    setDuracao(getDuration())
  }, 1000);

  function getDuration() {
    let dataATUAL = new Date();

    let ms = dataATUAL - pedido.data_inic;

    let m = ms / 1000 / 60;

    let h = m / 60;

    m = h % 1 * 60

    let d = h / 24;



    let dur = (d < 1 ? "" : Math.floor(d) + "d") 

    if(dur === ''){
      dur = (h < 1 ? "" : Math.floor(h) + "h")
      if(dur === ''){
        dur = Math.floor(m) + "m"
    }else{
      dur = dur + Math.floor(m)
    }
    }

    return dur;
  }

  function CorTipo() {
    switch (pedido.tipo) {
      case "CAIXA":
        return "#2b2e30";

      case "ENTREGA":
        return "#040ac9";

      case "APLICATIVO":
        return "#591357";
        
        default:
          return '#000'
    }
  }

  function CorHora() {
    let data_atual = new Date();
    let diff = (data_atual - pedido.data_inic) / 1000 / 60 

    

    if (diff < 10) {
      return "#02fa3c";
    } else if (diff < 20) {
      return "#a3d609";
    } else if (diff < 30) {
      return '#fff700';
    } else if (diff < 40) {
      return "#fcb01e";
    } else if (diff < 50) {
      return "#fa5311";
    } else if (diff < 60) {
      return "#bf0f06";
    } else if (diff < 120) {
      return "#c20839";
    } else if (diff <= 150) {
      return "#8108c2";
    } else {
      return "#17091f";
    }
  }

  function CorValor() {
    let diff = pedido.valor - pedido.valorPago;

    if (diff === pedido.valor) {
      return "#bf0f06";
    } else if (diff > 0) {
      return "#bd7c00";
    } else if (diff === 0) {
      return "#126125";
    } else {
      return "#1e272e";
    }
  }

  function CorImpr() {
    if (pedido.impr === 0) {
      return "#bf0f06";
    } else {
      return "#126125";
    }
  }

  function IcoTipo() {
    switch (pedido.tipo) {
      case "CAIXA":
        return faHome;
      case "ENTREGA":
        return faTruck;
      case "APLICATIVO":
        return faMobile;
      default:
        return faQuestion;
    }
  }

  // let images = require.context('../../images', true);

  // let itemImg = images(`./${pedido.cli_img}`).default;

  return (
    <Estilo
      pedido={{
        ...pedido,
        cortipo: CorTipo,
        corhora: CorHora,
        corvalor: CorValor,
        corimpr: CorImpr,
      }}
      className="pedido"
    >
      <img src={pedido.cli_img} alt="Imagem do cliente" />
      <div className="informacoes">
        <p className="nome-cliente">{pedido.cli_nome}</p>
        <div className="info-secundarias">
          <span className="tipo" title={pedido.tipo}>
            <FontAwesomeIcon className="ico" icon={IcoTipo()} />
          </span>
          <span className="tempo">
            <FontAwesomeIcon className="ico" icon={faClock} />
            <p>{duracao}</p>
          </span>
          <span className="valor">
            <FontAwesomeIcon className="ico" icon={faMoneyBillWaveAlt} />
            <p>{formatReal(pedido.valor)}</p>
          </span>
          <span className="impr">
            <FontAwesomeIcon className="ico" icon={faPrint} />
            <p>{pedido.impr}</p>
          </span>
        </div>
      </div>
    </Estilo>
  );
}
