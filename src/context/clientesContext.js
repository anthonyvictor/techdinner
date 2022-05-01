import React, {useContext, useState, createContext, useEffect} from "react";
import { useApi } from "../api";

const ClientesContext = createContext()


export default function ClientesProvider({ children }) {
    const [clientes, setClientes] = useState([])
    const [atualizar, setAtualizar] = useState(0)
    const {api} = useApi()

        useEffect(() => {            
            let montado = true

            async function getAll(){
                api().get('clientes').then(r=>
                    {if(montado) setClientes(r.data)}
                )
            }

            getAll()
            return () => {montado = false}
        },[atualizar, ])     

        const refresh = (cliente) => {
            if(cliente){
                setClientes(prev => [...prev.filter(c => c.id !== cliente.id), cliente])
            }else{
                setAtualizar(prev => prev + 1)
            }
        }

        async function excluir(cliente){
                const payload ={
                    data: {id: cliente.id}
                  }
                  const resp = await api().delete('clientes/excluir', payload)
                  resp.data && setClientes(prev => prev.filter(e=> e.id !== cliente.id))
        }
    return(
        <ClientesContext.Provider value={{clientes, setClientes, refresh, excluir}}>
            {children}
        </ClientesContext.Provider>
    )
}

export const useClientes = () => {
    return useContext(ClientesContext)
} 