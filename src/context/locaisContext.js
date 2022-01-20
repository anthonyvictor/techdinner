import React, { createContext, useContext, useState } from "react";

const LocaisContext = createContext();

function LocaisProvider(props) {
  const [locais, setLocais] = useState([]);
  return (
    <LocaisContext.Provider value={{ locais, setLocais }}>
      {props.children}
    </LocaisContext.Provider>
  );
}

export default LocaisProvider;

export const useLocais = () => {
    return useContext(LocaisContext)
}