import React, {useContext, useState, createContext, useEffect, useRef} from "react";
import Axios from 'axios'
import * as Format from "../util/Format";
import { isNEU } from "../util/misc";

const ClientesContext = createContext()


export default function ClientesProvider({ children }) {
    const [clientes, setClientes] = useState([])
    const [atualizar, setAtualizar] = useState(0)
        useEffect(() => {            
            let montado = true
            async function getAll(){
                Axios.get(`${process.env.REACT_APP_API_URL}/clientes`).then(r=>
                    {if(montado) setClientes(r.data.map(e=> {return {...e, imagem: (e.imagem ? Format.convertImageToBase64(e.imagem) : null)}})) }
                )
            }   
            getAll()
            return () => {montado = false}
        },[atualizar, ])     

        const refresh = () => {
            setAtualizar(prev => prev + 1)
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