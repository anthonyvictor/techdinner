import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TabControlContext = createContext()

function TabControlProvider(props) {
    
    const location = useLocation()
    const [currentTab, setCurrentTab] = useState();

  function getDefault() {
    if (location.pathname) {
      for(let e of props.tabs){
        if(e.link === location.pathname){
          return e.elemento
        }
      }
    } else {
      return props.tabs[0].elemento;
    }
  }

  return (
        <TabControlContext.Provider value={{currentTab, setCurrentTab, tabs: props.tabs, getDefault}}  >
            {props.children}
        </TabControlContext.Provider>
    )
}

export default TabControlProvider;


export const useTabControl = () => {
    return useContext(TabControlContext)
}