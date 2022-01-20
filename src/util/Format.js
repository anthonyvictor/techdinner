import { MyDDD } from './local'
import { isNEU } from './misc';

export function formatReal(valor) : string {
    return valor.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  export function formatCEP(valor) {
    return `${valor.slice(0,5)}-${valor.slice(5,8)}`
  }

  export function formatNumber(valor){
    return valor.replace(/[^0-9]/ig, "")
  }

  export function formatPhoneNumber(valor, manterDDD, manterDDI = false){
    // Remove the Country code
    valor = valor.replace('+55','')
    valor = valor.startsWith('55') && valor.length > 11 ? valor.replace(/^(55)/,'') : valor

    valor = valor.slice(0,1) === '0' ? valor.slice(1,valor.length) : valor
    valor = formatNumber(valor)
    let _ddd, _num, _ddi
    _ddi = manterDDI ? '+55' : ''
    switch(valor.length){
      case 11: //00 90000-0000
        _ddd = valor.slice(0,2)
        _ddd = manterDDD === true || _ddd !== MyDDD() ? _ddd + ' ' : ''
        _num = valor.slice(2,7) + '-' + valor.slice(7)
        break;
      case 10: //00 0000-0000
        _ddd = valor.slice(0,2)
        _ddd = manterDDD === true || _ddd !== MyDDD() ? _ddd + ' ' : ''
        _num = '9' + valor.slice(2,6) + '-' + valor.slice(6)
        break;
      case 9: //90000-0000
        _ddd = manterDDD === true ? MyDDD() + ' ' : ''
        _num = valor.slice(0,5) + '-' + valor.slice(5)
        break;
      case 8: //0000-0000
        _ddd = manterDDD === true ? MyDDD() + ' ' : ''
        _num = '9' + valor.slice(0,4) + '-' + valor.slice(4)
        break;
      default:
        _ddd = ''
        _num = valor
        break;
    }
    
    valor = _ddi + _ddd + _num
    return valor
  }

  export function formatEndereco(endereco, opcoes){
    if(!isNEU(endereco)){
      if(typeof endereco === 'object' && !Array.isArray(endereco)){
        let _taxa = opcoes.withTaxa === true ? formatReal(endereco.taxa) : ''
        let _loc = opcoes.withLocal && endereco.local ? endereco.local : '' 
        let _log = endereco.logradouro
        let _num = opcoes.withLocal && endereco.numero ? endereco.numero : '' 
        let _bai = endereco.bairro
        let _ref = opcoes.withLocal &&  endereco.referencia ? endereco.referencia : ''
        let _cep = formatCEP(endereco.cep)
          return [_taxa.toString(), _loc.toString(), _log.toString(), 
            _num.toString(), _bai.toString(), _ref.toString(), 
            _cep].filter(x => x !== '').join(', ') 
      }else{
        return endereco
      }
    }else{
      return ''
    }
  }