export const Cumprimento = () => {
  let atual = new Date();
  if (atual >= 18) {
      return 'Boa noite!'
  }else if(atual >= 12){
      return 'Boa tarde!'
  }else{
      return 'Bom dia!'
  }
};
