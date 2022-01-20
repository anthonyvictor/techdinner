import React, { createContext, useContext, useEffect, useState } from 'react';
import { isNEU } from "../util/misc";

const TabControlContext = createContext()

function TabControlProvider(props) {
    
    const [tabs, setTabs] = useState(props.tabs)
    const [currentTab, setCurrentTab] = useState(getDefault());

  function getDefault() {
    if (!isNEU(props.tabInicial)) {
      let listFilter = tabs.filter(
        (t) => t.titulo.toUpperCase() === props.tabInicial.toUpperCase()
      );
      if (!isNEU(listFilter) && listFilter.length > 0) {
        return listFilter.pop().elemento;
      }
    } else {
      return tabs[0].elemento;
    }
  }

  return (
        <TabControlContext.Provider value={{currentTab, setCurrentTab, tabs}}  >
            {props.children}
        </TabControlContext.Provider>
    )
}

export default TabControlProvider;


export const useTabControl = () => {
    return useContext(TabControlContext)
}