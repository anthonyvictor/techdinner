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
        if(where === 'local') return process.env.REACT_APP_API_URL_LOCAL
        if(where === 'fixed') return process.env.REACT_APP_API_URL //_LOCAL
        if(where === 'web') return null//'192.168.252.115:8081'
        return process.env.REACT_APP_API_URL_LOCAL
    }

    const api = (user=null, password=null) => {
        const url =  getApiUrl('fixed') //local, fixed, web
        if(!url) return null
        return axios.create({
            baseURL: url, 
            auth: {
              username: user ?? getStored('user'),
              password: password ?? getStored('password')
            },
            timeout: 2000
          })
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
        

        if(err.code === 'ECONNABORTED'){
            message('error', 'Tempo para conexão esgotado. Verifique sua conexão com a internet.')
        }else if(err.response.status === 403){
            message('error', 'Usuário ou senha inválidos!')            
        }else{
            alert(`Ocorreu um erro!`)
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
