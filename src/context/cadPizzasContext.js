import React, { createContext, useContext, useState } from 'react';

const CadPizzasContext = createContext()

function CadPizzasProvider({children}) {
    const [searchSab, setSearchSab] = useState('')
    const [listaSab, setListaSab] = useState(<></>)
    const [currSab, setCurrSab] = useState(null)

    const [searchIngr, setSearchIngr] = useState('')
    const [listaIngr, setListaIngr] = useState(null)
    const [currIngr, setCurrIngr] = useState(null)

    const [searchTam, setSearchTam] = useState('')
    const [listaTam, setListaTam] = useState(null)
    const [currTam, setCurrTam] = useState(null)
    
    return (
        <CadPizzasContext.Provider value={{
            searchSab, setSearchSab,
            listaSab, setListaSab,
            currSab, setCurrSab,

            searchIngr, setSearchIngr,
            listaIngr, setListaIngr,
            currIngr, setCurrIngr,

            searchTam, setSearchTam,
            listaTam, setListaTam,
            currTam, setCurrTam
        }}>
            {children}
        </CadPizzasContext.Provider>
    )
}

export default CadPizzasProvider;


export const useCadPizzas = () => {
    return useContext(CadPizzasContext)
} 

