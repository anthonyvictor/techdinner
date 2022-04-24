import axios from "axios"
import React, { useState, createContext, useContext, useEffect } from "react"
import { useMessage } from "./components/Message"
import { getStored, setStored } from "./util/local"
import { isConnected, isNEU } from "./util/misc"


const ApiContext = createContext()

export default function ApiProvider({children}) {

    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const {message} = useMessage()
    
    useEffect(() => {
        refresh()
    }, [])

    const getApiUrl = (where) => {
        
        //EM QUALQUER LUGAR, MAS NÃO CONECTA AO BANCO PELO CELULAR
        if(where === 'local') return process.env.REACT_APP_API_URL_LOCAL 

        //SOMENTE SE O PC TIVER IP FIXO NA REDE
        if(where === 'fixed') return process.env.REACT_APP_API_URL_HOME
        
        //SOMENTE SE O PC TIVER IP FIXO NA REDE DA PIZZARIA
        if(where === 'pizza') return process.env.REACT_APP_API_URL_PIZZARIA
        
        //SOMENTE COM INTERNET, EM PCS CONECTADOS VIA HAMACHI
        if(where === 'hamachi') return process.env.REACT_APP_API_URL_HAMACHI

        //SÓ COM INTERNET, EM SERVIDOR WEB (NÃO IMPLEMENTADO)
        if(where === 'web') return process.env.REACT_APP_API_URL_WEB

        return process.env.REACT_APP_API_URL_LOCAL
    }

    const api = (user=null, password=null) => {
        const url =  process.env.NODE_ENV === 'development' 
        ? getApiUrl('local') 
        : getApiUrl('fixed')

        if(!url) return null
        const newApi = axios.create({
            baseURL: url, 
            auth: {
              username: user ?? getStored('user'),
              password: password ?? getStored('password')
            },
            timeout: 10000
          })

          return newApi
    }

    function refresh(newUser=null, newPassword=null){
       const user = newUser || getStored('user')
       const password = newPassword || getStored('password')

       if(!isNEU(user) && !isNEU(password)){
            setIsLoading(true)

            api(user, password).get('auth')
            .then(response => onSuccess(response))
            .catch(err => onError(err))
            .finally(() => onFinally())
        }
    }

    function onSuccess(response){
        if(response.data){
            message()
            setUser(response.data)
        }
    }
    function onError(err){
        const jsonError = JSON.stringify(err).toUpperCase()

        if(err.code === 'ECONNABORTED'){
            message('error', 'Tempo para conexão esgotado. Sem resposta do servidor.')
        }else if(err?.response?.status === 403){
            message('error', 'Usuário ou senha inválidos!')   
        }else if(jsonError.includes('NETWORK ERROR')){
            message('error', 'Verifique sua conexão com a internet!')
        }else{
            message('onError', 'Ocorreu um erro!')
            console.error(err, err.stack)
        }
    }
    function onFinally(){
        setIsLoading(false)
    }

    return (
        <ApiContext.Provider value={{user, refresh, isLoading, api}}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => {
   return useContext(ApiContext)
}
