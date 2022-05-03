import React, { createContext, useContext, useEffect, useState } from 'react'
import { useApi } from '../api'

const RelatoriosContext = createContext()
 
export const RelatoriosProvider = ({children}) => {

    const {api} = useApi()

    const [relatorios, setRelatorios] = useState([])
    const [filtro, setFiltro] = useState(null)

    useEffect(() => {
        let montado = true
        async function getRelatorios(){
            const payload = ( 
                filtro 
                    ? {...filtro} 
                    : {periodos: [{dataInic: new Date(), dataFim: new Date()}]} 
                    // : {periodos: [{dataInic: new Date(2021, 4, 10, 0, 0, 0), dataFim: new Date(2021, 4, 20, 0, 0, 0)}]} 
                )
                // periodos: [{dataInic: new Date(2021, 5, 10, 0,0,0), dataFim: new Date(2021, 7, 10,0,0,0)}]
            
            api().get('relatorios', {params: payload}).then(res => {
                if (montado) setRelatorios(res?.data ?? [])
            })
        }
        getRelatorios()
        return () => {montado = false}
    }, [filtro, ])

    function carregar({ids, tipos, periodos, status}){
        setFiltro({ids, tipos, periodos, status})
    }

    return(
        <RelatoriosContext.Provider value={{
            relatorios, carregar
        }}>
            {children}
        </RelatoriosContext.Provider>
    )
}

export const useRelatorios = () => {
    return useContext(RelatoriosContext)
}

