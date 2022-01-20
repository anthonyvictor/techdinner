import React, { createContext, useContext, useState } from "react";

const BairrosContext = createContext();

function BairrosProvider(props) {
  const [bairros, setBairros] = useState([]);
  return (
    <BairrosContext.Provider value={{ bairros, setBairros }}>
      {props.children}
    </BairrosContext.Provider>
  );
}

export default BairrosProvider;

export const useBairros = () => {
    return useContext(BairrosContext)
}