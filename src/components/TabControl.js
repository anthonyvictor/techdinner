import React, { createContext, useContext, useState } from 'react'
import styled from 'styled-components'
import { cores } from '../util/cores'
import { MobileSizes } from '../util/devices'

const TabControlContext = createContext()

export const TabControl = ({ tabs, index, children }) => {
  const [currentTab, setCurrentTab] = useState(tabs[(index ?? 0)])
    return (
        <TabControlContext.Provider value={{ tabs, currentTab, setCurrentTab }}>
          <TabControl2 />
          {children}
        </TabControlContext.Provider>
    )
}

export const useTabControl = () => {
    return useContext(TabControlContext)
}

const TabButton = ({tab}) => {
    const { currentTab, setCurrentTab } = useTabControl()

    function changeTab() {
        setCurrentTab(tab)
    }
    return (
        <TabButtonContainer className={currentTab.title === tab.title ? 'current' : undefined} onClick={changeTab}>
            {tab.title}
        </TabButtonContainer>
    )
}


const TabButtonContainer = styled.button`
    margin-left: 5px;
    margin-top: 3px;
    outline: none;
    border: 0.5px solid gray;
    border-radius: 10px;
    min-width: 180px;
    height: 120%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    cursor: pointer;

    &.current {
        background-color: ${cores.brancoEscuro};
    }

    &:hover {
        background-color: ${cores.cinza};
    }

    @media (max-width: ${MobileSizes.cellphone}) {
        margin-left: 0;
        margin-top: 0;
        border-radius: 2%;
        height: 100%;
        flex-grow: 2;
    }
`

const TabControl2 = () => {
    const { tabs } = useTabControl()
    if(tabs.length < 2) return <></> 
    return (
        <Container>
            {tabs?.map(t => <TabButton key={t.title} tab={t} />)}
        </Container>
    )
}



const Container = styled.div`
    width: 100%;
    height: 40px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    background-image: linear-gradient(white 50%, ${cores.branco} 50%);

    @media (max-width: 550px) {
        width: 100%;
        height: 50px;
        overflow-y: hidden;
        overflow-x: auto;
        display: flex;
        gap: 5px;
        background-image: linear-gradient(${cores.branco} 50%, white 50%);
    }
`
