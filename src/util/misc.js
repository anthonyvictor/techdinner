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

export async function copiarParaClipboard(val){
  await navigator.clipboard.writeText(val)

}

export async function colarDoClipboard({obj, setObj}){
//   await navigator.clipboard.readText().then((e) => {
// console.log(e)
// // fetch(e)
// //   .then(response => response.blob())
// //   .then(imageBlob => {
// //       const imageObjectURL = URL.createObjectURL(imageBlob);
// //       setObj(imageBlob)
// //   })
//   })

}

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
    val == null ||
    val == "" ||
    (Array.isArray(val) && val.length === 0) ||
    (val.constructor === Object && Object.keys(val).length === 0)

  );
};


const fileSize = (size) => {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const fileType = (fileName) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
}
