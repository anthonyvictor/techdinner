import React, { useCallback, useEffect, useState } from "react";
import { focusBusy } from "../util/misc";

export const Keyer = ({searchRef, arr, hovered, click, canClick}) => {

    const specialKeys = ['ArrowDown', 'ArrowUp', 'Enter']
    const alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    const [specialKeyPressed, setSpecialKeyPressed] = useState(null)
    const {currentHovered, setCurrentHovered, currentHoveredRef} = hovered

    useEffect(() => {
        addKeyPressEventHandler()
        return () => removeKeyPressEventHandler()
    }, []) //eslint-disable-line

    useEffect(() => {
        keyPressHandler()
    }, [specialKeyPressed]) //eslint-disable-line

    function runClick(object){
        if(!canClick || canClick(object)) click(object)
    }

    const keyPressHandler = () => {
        if (specialKeyPressed && arr.length > 0 && !focusBusy()) {
            let index = currentHovered ? arr.map(e => e.id).indexOf(currentHovered.id) : -1
            const up = { is: specialKeyPressed === 'ArrowUp', val: index > 0 ? arr[index - 1] : arr[index] }
            const down = {
                is: specialKeyPressed === 'ArrowDown',
                val: index < arr.length - 1 ? arr[index + 1] : arr[index],
            }
            const enter = { is: specialKeyPressed === 'Enter' && (currentHovered || arr.length === 1) }

            if (enter.is) {
                let current = arr[0]
                if(arr.length > 1){
                    current = currentHovered ?? arr[0]
                }
                runClick(current)
            } else {
                const newHovered = up.is ? up.val : down.val
                setCurrentHovered(newHovered)
            }
        }
    }

    const keyDownHandler = useCallback((event) => {
        if (
            [...alphaNum, 'BACKSPACE'].some(e => e === event.key.toUpperCase()) &&
            document.activeElement !== searchRef.current && !focusBusy()
        ) {
            searchRef.current.focus()
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