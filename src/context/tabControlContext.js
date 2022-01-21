import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isNEU } from "../util/misc";

const TabControlContext = createContext()

function TabControlProvider(props) {
    
    const location = useLocation()
    

  function getDefault() {
    if (location.pathname) {
      let filtered = props.tabs.filter(e => e.link === location.pathname)
      console.log(filtered)
      if (!isNEU(filtered) && filtered.length > 0) {
        return filtered.pop().elemento;
      }
    } else {
      return props.tabs[0].elemento;
    }
  }

  const [currentTab, setCurrentTab] = useState(getDefault());

  return (
        <TabControlContext.Provider value={{currentTab, setCurrentTab, tabs: props.tabs}}  >
            {props.children}
        </TabControlContext.Provider>
    )
}

export default TabControlProvider;


export const useTabControl = () => {
    return useContext(TabControlContext)
}