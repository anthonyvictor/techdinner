import * as icons from '@fortawesome/free-solid-svg-icons';

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