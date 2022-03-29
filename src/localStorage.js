// import React, { useState, createContext, useContext, useEffect } from "react"

// const LocalStorageContext = createContext()

// function getStorageValue(key, defaultValue) {
//     const saved = localStorage.getItem(key)
//     const initial = JSON.parse(saved)
//     return initial || defaultValue
// }
// function setStorageValue(key, value) {
//     localStorage.setItem(key, JSON.stringify(value))
// }

// export default function LocalStorageProvider({children}) {

//     const [value, setValue] = useState(null)//() => getStorageValue(key, defaultValue))

//     return (
//         <LocalStorageContext.Provider value={{getStorageValue, setStorageValue}}>
//             {children}
//         </LocalStorageContext.Provider>
//     )
// }


// export const useLocalStorage = (key, defaultValue) => {
//     const {getStorageValue, setStoredValue} = useContext(LocalStorageContext)
//     const storedValue = () => getStorageValue(key, defaultValue)
//     return [storedValue, setStoredValue]
// }
