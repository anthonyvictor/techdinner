import * as icons from '@fortawesome/free-solid-svg-icons';
import * as misc from './misc'
export function IcoTipo(tipo) {
    switch (tipo) {
      case "CAIXA":
        return icons.faHome;
      case "ENTREGA":
        return icons.faTruck;
      case "APLICATIVO":
        return icons.faMobile;
      default:
        return icons.faQuestion;
    }
  }


  export function getDataPagamentoDescrito(data){
    // data  = misc.toDate(data)
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