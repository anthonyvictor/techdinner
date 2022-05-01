import axios from "axios"
import React, { useState, createContext, useContext, useEffect, useCallback } from "react"
import { useInternetChecker } from "./components/InternetChecker"
import { useMessage } from "./components/Message"
import { getStored, setStored } from "./util/local"
import { isConnected, isNEU } from "./util/misc" 

const ApiContext = createContext()

export default function ApiProvider({children}) {

    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const {message} = useMessage()
    const [fixedHost, setFixedHost] = useState('')
    const {isOnline} = useInternetChecker()
    const [apiUrl, setApiUrl] = useState('')

    useEffect(() => {
        // if(process.env.REACT_APP_API_URL_HOME_WIFI){
        //     const resp = window.confirm('O computador está conectado ao wifi ou via cabo?', 'cabo')
            
        // }
        refresh()
    }, [])

    function getLocalUrl(url){
        // const local = process.env.REACT_APP_API_URL_LOCAL
        // if(!isOnline && !url.includes(local)){
        //     const oldUrlMatch = url.match(/:[0-9]+/)
        //     const oldUrl = 
        //     url.substring(0, oldUrlMatch.index + oldUrlMatch[0].length)
        //     url = url.replace(oldUrl, local)
          return url
    
        // }
      }

    const getApiUrl = (where) => {
        let r = ''
        //EM QUALQUER LUGAR, MAS NÃO CONECTA AO BANCO PELO CELULAR
        if(where === 'local') r = process.env.REACT_APP_API_URL_LOCAL 

        //SOMENTE SE O PC TIVER IP FIXO NA REDE
        if(where === 'fixed') r = process.env.REACT_APP_API_URL_HOME
        
        //SOMENTE SE O PC TIVER IP FIXO NA REDE DA PIZZARIA
        if(where === 'pizza') r = process.env.REACT_APP_API_URL_PIZZARIA
        
        //SOMENTE COM INTERNET, EM PCS CONECTADOS VIA HAMACHI
        if(where === 'hamachi') r = process.env.REACT_APP_API_URL_HAMACHI

        //SÓ COM INTERNET, EM SERVIDOR WEB (NÃO IMPLEMENTADO)
        if(where === 'web') r = process.env.REACT_APP_API_URL_WEB

        r = r === '' ? process.env.REACT_APP_API_URL_LOCAL : r

        setApiUrl(r)

        return r
    }

    const api = useCallback((user=null, password=null) => {
        const url =  process.env.NODE_ENV === 'development' 
        ? getApiUrl('fixed' )  
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
    })

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
        }else if(err?.response?.status === 503){
            message('error', 'Serviço indisponível no momento, tente mais tarde.')
            console.error('Database connection error', err.stack)   
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
        <ApiContext.Provider value={{user, refresh, isLoading, api, apiUrl, getLocalUrl}}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => {
   return useContext(ApiContext)
}
