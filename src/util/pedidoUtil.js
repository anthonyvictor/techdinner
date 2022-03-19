import { faHome, faTruck, faMobile, faQuestion } from '@fortawesome/free-solid-svg-icons';

export function IcoTipo(tipo) {
    switch (tipo) {
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

  export function CorTipo(tipo) {
    switch (tipo) {
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


  export function getDataPagamentoDescrito(data){

    data = new Date(data)
    let horas = data.toLocaleTimeString([], {timeStyle: 'short'})

    let dataATUAL = new Date();

    let ms = dataATUAL - data;

    let m = ms / 1000 / 60;

    let h = m / 60;

    m = h % 1 * 60

    let d = h / 24;

    return (
      d < 1 
      ? `às ${horas}` 
      : d < 2
      ? `ontem às ${horas}` 
      : `em ${data.toLocaleDateString()}`
      ) 

}

export function getValorPago(pedido){
  return pedido.pagamentos.filter(e => e.status === 1).reduce((a,b) => a + b, 0) || 0
}
export function getValorPendente(pedido){
  return pedido.valor - getValorPago(pedido)
}