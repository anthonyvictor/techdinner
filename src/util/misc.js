import { formatPhoneNumber } from "./Format";
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  export function isConnected(){
    return navigator.connection.rtt > 0
  }


  export function loadImage(setObj) {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*";
    input.onchange = _ => {
        let files = Array.from(input.files);
        setObj((URL.createObjectURL(files[0])))
    };
    
    input.click();
    
}

export async function copiar(val){
  // await navigator.clipboard.writeText(val)

  navigator.clipboard.writeText(val).then(function() {
    alert('copiou')
  }, function() {
    alert('não copiou')
  });

}

// export async function colarDoClipboard({obj, setObj}){
//   await navigator.clipboard.readText().then((e) => {
// setObj(e.replace('"',''))
// // // fetch(e)
// // //   .then(response => response.blob())
// // //   .then(imageBlob => {
// // //       const imageObjectURL = URL.createObjectURL(imageBlob);
// // //       setObj(imageBlob)
// // //   })
//   })

// }

/**
 * @name isNullEmptyUndefined
 * @description Checa se o valor é = null || empty || undefined
 * @param {*} val 
 * @returns true or false
 */
export function isNEU (val) {
  return (
    // assim, nós também podemos verificar valores undefined. null == undefined = true
    // nós queremos que {} retorne false. não podemos usar !! porque !!{} retorna true
    // !!{} = true and !!{name:"yilmaz"} = true. !! não funciona com objetos
    !val ||
    val === null ||
    val === "" ||
    val === 'null' ||
    (Array.isArray(val) && val.length === 0) ||
    (typeof(val) === 'object' && Object.keys(val).length === 0)

  );
};


// const fileSize = (size) => {
//   if (size === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(size) / Math.log(k));
//   return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }

// const fileType = (fileName) => {
//   return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
// }


export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function removeAccents(txt){
  return String(txt)
  .replace(/[ÀÁÂÃÄÅ]/ig,'A')
  .replace(/[Ç]/ig,'C')
  .replace(/[ÈÉÊË]/ig,'E')
  .replace(/[ÌÍÎÏ]/ig,'I')
  .replace(/[ÒÓÔÕÖ]/ig,'O')
  .replace(/[ÙÚÛÜ]/ig,'U')

  .replace(/[àáâãäå]/ig,'a')
  .replace(/[ç]/ig,'c')
  .replace(/[èéêë]/ig,'e')
  .replace(/[ìíîï]/ig,'i')
  .replace(/[òóôõö]/ig,'o')
  .replace(/[ùúûü]/ig,'u')
  .trim()
}


export function joinObj(obj){
  let txt = ''
    if(obj){
      for(let v of Object.values(obj)){
        if(typeof v === 'object'){
              txt = [txt, joinObj(v)].filter(Boolean).join()
          }else{
              txt = [txt,v].filter(Boolean).join()
          }
      }
    }
  return txt
}

export function removeImagens(obj){
	let newObj = obj
    	if(newObj){
      	for(let v of Object.keys(newObj)){
        		if(typeof newObj[v] === 'object'){
					//se a key atual do newObj for object {id: 0} ele atribui newObj = removeImagens()
              		// newObj = removeImagens(newObj)
					  newObj[v] = removeImagens(newObj[v])
					}else{
					  if(v === 'imagem'){
						  newObj[v] = ''
					  }

              		// let tempObj = newObj.
          		}
      	}
    	}
  return newObj
}

export function join(arr, separator){
  return arr.map(e => String(e)).filter(e => e !== '').join(separator)
}

export const isVogal = (chr) => {
  return ['a', 'e', 'i', 'o', 'u'].includes(chr.toLowerCase());
}

export const arrayer = (obj) => {
  return Array.isArray(obj) ? obj : []
}

// function LugaresConhecidos(Mais) {
//   let l = ["hotel", "condominio", "conjunto", "hospital",
//            "edificio", "aparthotel", "apart", "hostel",
//            "convencoes", "clinica", "farmacia", "coletanea",
//            "ondina", "bahia", "residence", "barra",
//            "escola", "colegio", "estacao", "mansao", "residencial",
//            "pousada", "apartamento", "ufba", "solar"]
//   if(Mais){
//       l.push("AP", "APARTAMENTO", "SOL", "BELLA", "MAR", "PEDRA", "SEREIA", "PARK")
//   }
//   return l
// }

export function equals(a,b){
  return String(a) === String(b)
}

// function compareDate(a, b) {
//   var keyA = new Date(a),
//     keyB = new Date(b);
//   // Compare the 2 dates
//   if (keyA < keyB) return -1;
//   if (keyA > keyB) return 1;
//   return 0;
// }

/**
 * @name Filtro
 * @param {object} obj 
 * @param {String} search 
 * @returns 
 * @description Filtra os dados
 */
export function filtro(obj, search, longNumber = false, phoneNumber = false) {
  if (search !== "") {
  let txt = joinObj(obj)  
  
  let valConj = txt.toUpperCase().replace(/[^a-z0-9]/gi, "");
  
  txt = removeConjuncoes(txt)
  
  let pesqTexto = removeAccents(search)
  .toUpperCase()
  .replace("  ", " ")
  .replace("  ", " ")
  .replace(/[^a-z0-9]/gi, "");
  
  let pesqTextoConj = pesqTexto.toUpperCase().replace(/[^a-z0-9]/gi, "");
  pesqTexto = removeConjuncoes(pesqTexto)

    let pesqNumero = longNumber 
    ? pesqTexto.replace(/[^0-9]/gi) : ''

    let pesqPhone = phoneNumber 
    ? formatPhoneNumber(pesqNumero, false) : ''


    let val = txt.toUpperCase().replace(/[^a-z0-9]/gi, "");

    const p1 = val.includes(pesqTexto)
    
    const p2 = (longNumber && val.includes(pesqNumero))
    
    const p3 = (phoneNumber && !isNEU(pesqPhone) && val.includes(pesqPhone))
    
    const p4 = valConj.includes(pesqTextoConj)

    return p1 || p2 || p3 || p4
  } else {
    return true;
  }
}


export function removeConjuncoes(txt){
  let _txt = String(txt).replace(/\s*\b(DE|DA|DO|QUE|NA|NO|EM|\s+O|\s+E|\s+A|OU|UM|UMA)\b(?!$)/,'') 
  return _txt
}

export function isMobile(){
  return window.screen.width <= 760
}

export function toDate(dateStr) {
  let dmy = dateStr.split(' ')[0].split("/");
  let hms = dateStr.split(' ')[1].split(":");
  return new Date(dmy[2], dmy[1] - 1, dmy[0], hms[0] ?? 0, hms[1] ?? 0, hms[2] ?? 0);
}

export function focusBusy() {
  let focusedElement = document.activeElement
  let isInput = focusedElement.nodeName.toLowerCase() === 'input'
  let isNotSearch = focusedElement.getAttribute('type') !== 'search'
  return isInput && isNotSearch
}
