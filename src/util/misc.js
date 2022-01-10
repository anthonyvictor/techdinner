export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  export function isConnected(){
    return navigator.connection.rtt > 0
  }