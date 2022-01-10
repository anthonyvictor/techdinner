import { DDD } from '../context/local'

export function formatReal(valor) {
    return valor.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  export function formatNumber(valor){
    return valor.replace(/[^0-9]/ig, "")
  }

  export function formatPhoneNumber(valor, manterDDD){
    valor = valor.replace('+55','')
    valor = valor.slice(0,1) === '0' ? valor.slice(1,valor.length) : valor
    valor = formatNumber(valor)
    let _ddd, _num
    switch(valor.length){
      case 11: //00 90000-0000
        _ddd = valor.slice(0,2)
        _ddd = manterDDD === true || _ddd !== DDD() ? _ddd + ' ' : ''
        _num = valor.slice(2,7) + '-' + valor.slice(7)
        break;
      case 10: //00 0000-0000
        _ddd = valor.slice(0,2)
        _ddd = manterDDD === true || _ddd !== DDD() ? _ddd + ' ' : ''
        _num = '9' + valor.slice(2,6) + '-' + valor.slice(6)
        break;
      case 9: //90000-0000
        _ddd = manterDDD === true ? DDD() + ' ' : ''
        _num = valor.slice(0,5) + '-' + valor.slice(5)
        break;
      case 8: //0000-0000
        _ddd = manterDDD === true ? DDD() + ' ' : ''
        _num = '9' + valor.slice(0,4) + '-' + valor.slice(4)
        break;
      default:
        _ddd = ''
        _num = valor
        break;
    }
    
    valor = _ddd + _num
    return valor
  }

  export function formatEndereco(endereco : Object, taxa : Boolean){
    
  }