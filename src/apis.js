import { GoogleApiKey } from "./util/local";
import { formatNumber, formatPhoneNumber } from "./util/Format";
import { isConnected } from "./util/misc";

export async function getLatLng(endereco) {
  let res = null

  
  if (isConnected()){
    let logradouroEnabled = true  

    // 
    // 

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?sensor=false" +
    "&components=postal_code:" +
    endereco.cep.replace(/'[.-]'/gi, "") +
    "&address=" +
    endereco.logradouro.replace(" ", "+") +
    "|&country:Brazil&key=" +
    GoogleApiKey()

    console.log('url', url)

    const raw = await fetch(url, {method: 'GET'}).then((resp) => resp.json())
    .then((json) =>(res = json.results.length > 0 ? json.results[0].geometry.location : {}))
  }

  return res;
  //     .then((e) =>
  //       e.json()
  //         .then((data) => data.results.length > 0 ? data.results[0].geometry.location : {})
  //         .catch((e) => console.log(e))
  //     )
  //     .catch((e) => console.log(e));

  //   return resp;
}



export function sendWhatsAppMessage(txt, phoneNumber){
  phoneNumber = formatPhoneNumber(phoneNumber, true, true)
  phoneNumber = formatNumber(phoneNumber)
  window.open("https://api.whatsapp.com/send?phone=" + phoneNumber)
}