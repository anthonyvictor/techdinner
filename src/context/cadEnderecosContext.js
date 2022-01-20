import React, { createContext, useContext, useState } from 'react';

const CadEnderecoContext = createContext(null);

export default function CadEnderecoProvider(props) {
    const [count, setCount] = useState(0);

    return (
        <CadEnderecoContext.Provider value={{ count, setCount }}>
            {props.children}
        </CadEnderecoContext.Provider>
    );
}

export const useCadEndereco = () => {
    return useContext(CadEnderecoContext)
}