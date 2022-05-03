import * as local from "./util/local";
import { formatNumber, formatPhoneNumber } from "./util/Format";
import * as misc from "./util/misc";

export async function getLatLng(endereco) {
  let res = null

  
  if (misc.isConnected()){

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?sensor=false" +
    "&components=postal_code:" +
    endereco.cep.replace(/'[.-]'/gi, "") +
    "&address=" +
    endereco.logradouro.replace(" ", "+") +
    "|&country:Brazil&key=" +
    local.GoogleApiKey()

    await fetch(url, {method: 'GET'}).then((resp) => resp.json())
    .then((json) =>(res = json.results.length > 0 ? json.results[0].geometry.location : {}))
  }

  return res;
}

export function sendWhatsAppMessage(txt, phoneNumber){
  txt = txt !== '' ? "&text=" + txt.replace(' ', '+') : ''
  phoneNumber = formatPhoneNumber(phoneNumber, true, true)
  phoneNumber = formatNumber(phoneNumber)
  window.open("https://api.whatsapp.com/send?phone=" + phoneNumber + txt)
}

export async function getFileFromUrl(url, name, defaultType = 'image/jpeg'){
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export function enderecoToUrl(endereco){
  return new Promise((resolve, reject) => {
    if(!misc.isNEU(endereco.logradouro)){
      let logradouro = endereco.logradouro.replace(/\s\(+.+\)+/,'')
      let cidade = local.MyCity()
      let estado = local.MyStateCode()
      let cep = String(endereco.cep).replace(/[-.]/,'')
      let numero = endereco.numero ?? ''
      let all = [logradouro, numero, cidade, estado, cep]
      .filter(txt => !misc.isNEU(txt))
      .join(' ').toString()
      .replace(' ', '+')
      let url = new URL(`https://maps.google.com/maps?q=${all}`)
      resolve(url)
    }else{
      reject('Endereço vazio!!')
    }
  })
}






