import { GoogleApiKey } from "./context/local";
import { isConnected } from "./util/misc";

export async function getLatLng(endereco) {
  let res = null

  if (isConnected()){
    let logradouroEnabled = true  

    // 
    // endereco.logradouro.replace(" ", "+") +

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?sensor=false" +
    "&components=postal_code:" +
    endereco.cep.replace(/'[.-]'/gi, "") +
    "&address=" +
    "|&country:Brazil&key=" +
    GoogleApiKey()

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
