import React, { createContext, useContext, useState } from "react";

const InternetCheckerContext = createContext()

export function InternetCheckerProvider({children}){
    const [isOnline, setIsOnline] = useState(false)

    window.addEventListener('online', () => {
        console.log('isOnline')
        setIsOnline(true)
    })
    window.addEventListener('offline', () => {
        console.log('isOffline')
        setIsOnline(false)
    })
    return (
        <InternetCheckerContext.Provider value={{isOnline}}>
            {children}
        </InternetCheckerContext.Provider>
    )
}

export const useInternetChecker = () => {
    return useContext(InternetCheckerContext)
}

