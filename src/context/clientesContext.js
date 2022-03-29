import React, {useContext, useState, createContext, useEffect} from "react";
import { useApi } from "../api";
import * as Format from "../util/Format";

const ClientesContext = createContext()


export default function ClientesProvider({ children }) {
    const [clientes, setClientes] = useState([])
    const [atualizar, setAtualizar] = useState(0)
    const {api} = useApi()
        useEffect(() => {            
            let montado = true
            async function getAll(){
                api().get('clientes').then(r=>
                    {if(montado) setClientes(r.data.map(e=> {
                        return {...e, imagem: (e.imagem ? Format.convertImageToBase64(e.imagem) : null)}})) }
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
    return(
        <ClientesContext.Provider value={{clientes, setClientes, refresh}}>
            {children}
        </ClientesContext.Provider>
    )
}

export const useClientes = () => {
    return useContext(ClientesContext)
} 