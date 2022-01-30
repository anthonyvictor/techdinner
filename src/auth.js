import React, { useState, createContext, useContext } from "react"
// import { useLocal } from "./context/localContext"


const AuthContext = createContext()

export default function AuthProvider({children}) {
    const [user, setUser] = useState({
        name:'Jose', 
        enterprise: 'Pizzaria da Porra Loka'
    }) //name: 'João Paulo', age: '25', enterprise: 'Pizzaria Doce Sabor'
    // {
    //     name: localStorage.getItem('user'),
    //     password: localStorage.setItem('password')
    // }

    // useEffect(() => {

    // }, [user])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
   const context = useContext(AuthContext)
   const {user, setUser} = context
   return {user, setUser}
}