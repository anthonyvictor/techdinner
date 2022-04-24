import React, {useState, useEffect, useCallback} from 'react'
import styled from 'styled-components'
import { SearchBar } from '../../../../../../components/SearchBar'
import { usePizza } from '..'
import { focusBusy } from '../../../../../../util/misc'
import { SaborLi } from './saborLi'

export const SaboresLista = () => {
    const { 
        searchRef, focusSearch,
        searchString, setSearchString, 
        saborHovered, setSaborHovered, saborHoveredRef, 
        finalResults,
        checkUncheck,
        isSearchFocused, setIsSearchFocused
    } = usePizza()


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
            let index = saborHovered ? finalResults.map(e => e.id).indexOf(saborHovered.id) : -1
            const up = { is: specialKeyPressed === 'ArrowUp', val: index > 0 ? finalResults[index - 1] : finalResults[index] }
            const down = {
                is: specialKeyPressed === 'ArrowDown',
                val: index < finalResults.length - 1 ? finalResults[index + 1] : finalResults[index],
            }
            const enter = { is: specialKeyPressed === 'Enter' && (saborHovered || finalResults.length === 1) }
            
            if (enter.is) {
                let current = finalResults[0]
                if(finalResults.length > 1){
                    current = saborHovered ?? finalResults[0]
                }

                current.ativo && checkUncheck(current, !String(current.id).includes('s'))
            } else {
                setSaborHovered(up.is ? up.val : down.val)
            }
        }
    }

    const onPressValidator = useCallback(event => {
        if (event.type === 'keydown') {
            if (
                [...alphaNum, 'BACKSPACE'].some(e => e === event.key.toUpperCase()) &&
                document.activeElement !== searchRef.current && !focusBusy()
            ) {
                focusSearch()
            } else {
                onPress(event.key, event.key)
            }
        } else if (event.type === 'keyup') {
            onPress(event.key, null)
            if (saborHoveredRef.current && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                saborHoveredRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [])

    const onPress = useCallback((key, value) => {
        if (specialKeys.some(e => e === key)) {
            setSpecialKeyPressed(value)
        }
    }, [])

    const addKeyPressEventHandler = useCallback(() => {
        document.addEventListener('keydown', onPressValidator)
        document.addEventListener('keyup', onPressValidator)
    }, [])
    const removeKeyPressEventHandler = useCallback(() => {
            document.removeEventListener('keydown', onPressValidator)
            document.removeEventListener('keyup', onPressValidator)
    }, [])

    return (
        <Container>
            <SearchBar _ref={searchRef} 
            value={searchString} 
            setValue={setSearchString}
            onFocus={() => {setIsSearchFocused(true)}}
            onBlur={() => {setIsSearchFocused(false)}}
            />
            <ul onMouseLeave={() => setSaborHovered(null)}>
                {finalResults.map(sabor => {
                    return (
                        <SaborLi key={sabor.id} sabor={sabor} />
                    )
                })}
            </ul>
        </Container>
    )
}


const Container = styled.div`
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 50px;
        overflow-y: auto;
        > ul{
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-height: 50px;
            width: 100%;

            @media (min-width: 550px) {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-auto-rows: max-content;
                row-gap: 5px;
                column-gap: 5px;
            }

            overflow-y: auto;
            height: 100%;

            
        }

`
