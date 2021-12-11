import React, { useState, createContext, useContext } from "react"


const AuthContext = createContext()

export default function AuthProvider({children}) {
    const [user, setUser] = useState({name: 'João Paulo', age: '25', enterprise: 'Pizzaria Doce Sabor'})

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