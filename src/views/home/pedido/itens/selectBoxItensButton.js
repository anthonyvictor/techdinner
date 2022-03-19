import { faPizzaSlice, faGlassCheers, faIceCream, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const ItemButton = ({type, click}) => {

    const getTitle = () => {
        return type.charAt(0).toUpperCase() + type.slice(1)
    }

    const getColor = () => {
        if(type === 'pizzas') return {backgroundColor: '#ed4300'}
        if(type === 'bebidas') return {backgroundColor: '#e88b00'}
        if(type === 'outros') return {backgroundColor: '#a1522d'}
        if(type === 'recentes') return {backgroundColor: '#0c6b00'}
        if(type === 'combos') return {backgroundColor: '#961a90'}
    }

    const Icone = () => {

        if(type === 'pizzas') return <FontAwesomeIcon icon={faPizzaSlice} />
        if(type === 'bebidas') return <FontAwesomeIcon icon={faGlassCheers} />
        if(type === 'outros') return <FontAwesomeIcon icon={faIceCream} />
        if(type === 'recentes') return <FontAwesomeIcon icon={faHistory} />
        if(type === 'combos') return (
            <>
                <FontAwesomeIcon icon={faPizzaSlice} />
                <FontAwesomeIcon icon={faGlassCheers} />
            </>
        )
    }

    return (
        <button style={getColor()} onClick={() => click()}>
            <div className='top'>
                <Icone />
            </div>
            <label style={{pointerEvents: 'none'}}>{getTitle()}</label>
        </button>
    )
}