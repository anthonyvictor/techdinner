import { MyDDD } from './local'
import * as misc from './misc';

export function formatReal(valor) {
  const res = !isNaN(valor) ? Number.parseFloat(valor).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",}) : 'R$ 0,00'
    return res
  }

  export function formatCurrency(valor) {
    return Number.parseFloat(valor).toLocaleString("pt-br", {
      style: "decimal"})
  }

  export function formatCEP(valor) {
    valor = String(valor)
    if(valor.length === 8){
      return `${valor.slice(0,5)}-${valor.slice(5,8)}`
    }else{
      return valor
    }
    
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

  export function formatCNPJ(numero){
    numero = numero.replace(/[^0-9]/g, '')
    const res = `${
      numero.slice(0, 2)
    }.${
      numero.slice(2, 5)
    }.${
      numero.slice(5, 8)
    }/${
      numero.slice(8, 12)
    }-${
      numero.slice(12)
    }` 
    console.log('cnpj:',res)
    return res
  }

  export function formatEndereco(endereco, withTaxa = false, withLocal = true, withCep = true){
    if(!misc.isNEU(misc.joinObj(endereco))){
      if(typeof endereco === 'object' && !Array.isArray(endereco)){
        let _taxa = withTaxa && withTaxa === true ? formatReal(endereco.bairro.taxa) : ''
        let _loc = withLocal && endereco.local ? endereco.local : '' 
        let _log = [endereco.logradouro, endereco.complemento].filter(Boolean).join(', ')
        let _num = withLocal && endereco.numero ? endereco.numero : '' 
        let _bai = endereco.bairro?.nome ?? ''
        let _ref = withLocal &&  endereco.referencia ? endereco.referencia : ''
        let _cep = withCep ? formatCEP(endereco.cep) : ''
          return misc.join([_taxa.toString(), _loc.toString(), _log.toString(), 
            _num.toString(), _bai.toString(), _ref.toString(), 
            _cep], ', ') 
      }else{
        return endereco
      }
    }else{
      return ''
    }
  }

  export function formatBebida(obj){
    if(!misc.isNEU(obj)){
      let tipo = obj.tipo
      let nome = obj.nome
      let sabor = obj.sabor ? obj.sabor : ''
      let tamanho = formatLitro(obj.tamanho)

      return misc.join([tipo, nome, sabor, tamanho], ' ')
      
    }else{
      return ''
    }
  }

  export function formatLitro(ml){
    return ml >= 1000 ? ml / 1000 + 'L' : ml + 'ML'
  }

 export function formatAbrev(txt){
    const last = txt.charAt(txt.slice(0, 4))
    const vogal = misc.isVogal(last)
    if (vogal) {
        return txt.slice(0, 3)
    }else{
        return txt.slice(0, 4)
    }
    
}


export const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
}
export const decodeBase64 = (data) => {
  return Buffer.from(data, 'base64').toString('ascii');
}

export const convertFileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.rawFile);

  reader.onloadend = () => resolve({
      fileName: file.title,
      base64: reader.result
  });
  reader.onerror = reject;
});

export function convertArrayToBase64(arr) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
  return window.btoa(
     arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

export  function convertImageToBase64(imagem){
  if(!misc.isNEU(imagem)){
      if(typeof imagem === 'object'){
      let i = `data:image/png;base64, ${convertArrayToBase64(imagem.data)}`   
        //.toString('base64') //convertFileToBase64(imagem)
        if(i && i.length > 0) return i
      }else if(typeof imagem === 'blob'){
        // let i = await convertFileToBase64(imagem)
        // return i
      }else if(typeof imagem === 'string'){
        
      }
  }else{ return null }
}