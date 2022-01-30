import React, { createContext, useContext, useState } from 'react';

const LocalContext = createContext()

function LocalProvider({children}) {
    const [user, setUser] = useState({
        name: localStorage.getItem('user'),
        password: localStorage.setItem('password')
    })
    return (
            <LocalContext.Provider value={{user}, setUser} >
                {children}
            </LocalContext.Provider>
        )
}

export default LocalProvider;

export const useLocal = () => {
    return useContext(LocalContext)
}