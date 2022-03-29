import React, { useCallback, useEffect, useState } from "react";
import { focusBusy } from "../util/misc";

export const Keyer = ({
    searchRef, focusSearch, finalResults, 
    currentHovered, setCurrentHovered, currentHoveredRef,
    canClick, click
}) => {

    const specialKeys = ['ArrowDown', 'ArrowUp', 'Enter']
    const alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    const [specialKeyPressed, setSpecialKeyPressed] = useState(null)

    useEffect(() => {
        addKeyPressEventHandler()
        return () => removeKeyPressEventHandler()
    }, []) //eslint-disable-line

    useEffect(() => {
        keyPressHandler()
    }, [specialKeyPressed]) //eslint-disable-line

    const keyPressHandler = () => {
        if (specialKeyPressed && finalResults.length > 0 && !focusBusy()) {
            let index = currentHovered ? finalResults.map(e => e.id).indexOf(currentHovered.id) : -1
            const up = { is: specialKeyPressed === 'ArrowUp', val: index > 0 ? finalResults[index - 1] : finalResults[index] }
            const down = {
                is: specialKeyPressed === 'ArrowDown',
                val: index < finalResults.length - 1 ? finalResults[index + 1] : finalResults[index],
            }
            const enter = { is: specialKeyPressed === 'Enter' && (currentHovered || finalResults.length === 1) }
            
            if (enter.is) {
                let current = finalResults[0]
                if(finalResults.length > 1){
                    current = currentHovered ?? finalResults[0]
                }
                canClick(current) && click(current)
                //current.ativo && checkUncheck(current, !String(current.id).includes('s'))
            } else {
                setCurrentHovered(up.is ? up.val : down.val)
            }
        }
    }

    const keyDownHandler = useCallback((event) => {
        if (
            [...alphaNum, 'BACKSPACE'].some(e => e === event.key.toUpperCase()) &&
            document.activeElement !== searchRef.current && !focusBusy()
        ) {
            focusSearch()
        } else {
            onPress(event.key, event.key)
        }
    }, [])

    const keyUpHandler = useCallback((event) => {
        onPress(event.key, null)
        if (currentHoveredRef.current && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            currentHoveredRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    const onPress = useCallback((key, value) => {
        if (specialKeys.some(e => e === key)) {
            setSpecialKeyPressed(value)
        }
    }, [])

    const addKeyPressEventHandler = useCallback(() => {
        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)
    }, [])

    const removeKeyPressEventHandler = useCallback(() => {
            document.removeEventListener('keydown', keyDownHandler)
            document.removeEventListener('keyup', keyUpHandler)
    }, [])
    
    return (<></>)
}