import React, { createContext, useContext, useEffect, useState } from 'react'
import { useApi } from '../api'

const RelatoriosContext = createContext()
 
export const RelatoriosProvider = ({children}) => {

    const {api} = useApi()

    const [relatorios, setRelatorios] = useState([])
    const [filtro, setFiltro] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        let montado = true
        async function getRelatorios(){
            setIsRefreshing(true)
            const payload = ( 
                filtro 
                    ? {...filtro} 
                    : {periodos: [{dataInic: new Date(), dataFim: new Date()}]} 
                    // : {periodos: [{dataInic: new Date(2021, 4, 10, 0, 0, 0), dataFim: new Date(2021, 4, 20, 0, 0, 0)}]} 
                )
                // periodos: [{dataInic: new Date(2021, 5, 10, 0,0,0), dataFim: new Date(2021, 7, 10,0,0,0)}]
            
            api().get('relatorios', {params: payload}).then(res => {
                if (montado) setRelatorios(res?.data ?? [])
                setIsRefreshing(false)
            })
        }
        getRelatorios()
        return () => {montado = false}
    }, [filtro, ])

    function carregar({ids, tipos, periodos, status}){
        setFiltro({ids, tipos, periodos, status})
    }

    async function retomar(pedido){
        const res = await api().patch(`relatorios/retomar/${pedido.id}`)
            if(res.status === 200){
                setRelatorios(prev => prev.filter(e => e.id !== pedido.id))
            }else{
                console.dir(res)
            }
        
    }

    return(
        <RelatoriosContext.Provider value={{
            relatorios, carregar, isRefreshing, retomar
        }}>
            {children}
        </RelatoriosContext.Provider>
    )
}

export const useRelatorios = () => {
    return useContext(RelatoriosContext)
}

