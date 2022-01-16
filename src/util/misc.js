export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  export function isConnected(){
    return navigator.connection.rtt > 0
  }


  export function loadImage(defaultImage) {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*";
    input.onchange = _ => {
        let files = Array.from(input.files);
        defaultImage = (URL.createObjectURL(files[0]))
        return defaultImage
    };
    
    input.click();
    
}

export async function copiarParaClipboard(val){
  await navigator.clipboard.writeText(val)

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