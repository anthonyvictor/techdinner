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
                    {if(montado) setClientes(r.data)}
                )
            }

            getAll()
            return () => {montado = false}
        },[atualizar, ])     

        // async function getImages(ids){
        //     let res = []
        //     if(!Array.isArray(ids) || ids.length === 0){
        //         return res
        //     }
        //     for(let id of ids){
        //         const img = await api().get('clientes/imagens', {params: {clienteId: id}})
        //         if(img?.data?.length > 0){
        //             console.log(img.data)
        //             res.push({id, imagem: img.data})
        //         }
        //     }
        //     return res
        // }



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