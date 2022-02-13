import React, {createContext, useContext, useCallback, useEffect, useState} from 'react';
import * as misc from '../util/misc'

const ListaContext = createContext()

function ListaProvider(props) {
    //lista, all, itemClick, itemContext, multi, marked, setMarked, eventsListener

    const {fullDataArray} = props
    const [selectedDataArray, setSelectedDataArray] = useState(props.selectedDataArray ?? [])
    const setResponseArray = props.setResponseArray ?? (() => {})
    const [hoveredData, setHoveredData] = useState(null)
    const [lockHover, setLockHover] = useState(false)
    const {itemDoubleClick, itemRightClick} = props
    const allowMultiSelect = props.allowMultiSelect ?? false
    const allowSelect = props.allowSelect ?? false
    const allowKeyPressObserver = props.allowKeysObserver ?? true
    
    const specialKeys = ['ArrowDown', 'ArrowUp', 'Enter']
    const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    const [specialKeyPressed, setSpecialKeyPressed] = useState(null)

        useEffect(() => {
            if(allowKeyPressObserver){
                document.addEventListener("keydown",onPressValidator);
                document.addEventListener("keyup", onPressValidator)
            }
            return () => {
                document.removeEventListener("keydown",onPressValidator);
                document.removeEventListener("keyup",onPressValidator);
            }
        }, [])//eslint-disable-line


        useEffect(() => {
                setLockHover(true)
        }, [fullDataArray])

        const onPressValidator = useCallback((event) => {
            if(event.type === 'keydown'){

            if(props.searchRef){
                if (
                    [...alphaNum, 'BACKSPACE'].some(e => e === event.key.toUpperCase()) &&
                    document.activeElement !== props.searchRef.current && !focusBusy()
                ) {
                    props.searchRef.current.focus()
                } else {
                    onPress(event.key, event.key)
                }
            }else{
                onPress(event.key, event.key)
            }


            }else if(event.type === 'keyup'){
              onPress(event.key, null)
            }
          },[])

        function onPress (key, value){
            specialKeys.some(e => e === key) && setSpecialKeyPressed(value)
        }

        function focusBusy(){
            let focusedElement = document.activeElement
            let isInput = focusedElement.nodeName.toLowerCase() === 'input'
            let isNotSearch = focusedElement.getAttribute('type') !== 'search' 
            return isInput && isNotSearch
        }

        function onConfirm(){
            setResponseArray(selectedDataArray)
        }

        function onItemClick(event, data){
            if(allowMultiSelect){
              if(selectedDataArray.length > 0){
                let res = selectedDataArray.filter(e => misc.equals(e.id, data.id))
                if(res.length > 0){
                    //SE JÁ TEM NA LISTA, REMOVE
                    setSelectedDataArray(selectedDataArray.filter(e => !misc.equals(e.id, res[0].id)))
                }else{
                    //SE NÃO TEM, ADICIONA
                    setSelectedDataArray([...selectedDataArray, data])
                }
              }else{
                setSelectedDataArray([data])
              }
            }else if(event.type === 'dblclick'){
                itemDoubleClick(data)
            }else if(event.type === 'click' && allowSelect){
                setSelectedDataArray([data])
                setResponseArray([data])
            }
          }

        function onRightClick(event, data){
            event.preventDefault()
            itemRightClick(data)
        }

        function getIndex(data){
            return data && fullDataArray.map(e => e.id).indexOf(data.id)
        }
const itemDoubleClickCondition = (props.itemDoubleClickCondition ?? (() => true))
        useEffect(() => {
            if (specialKeyPressed && fullDataArray.length > 0 && !focusBusy()) {

                let index = getIndex(hoveredData) ?? -1
                const up = {is: specialKeyPressed === 'ArrowUp', 
                    val : index > 0 ? fullDataArray[index - 1] : fullDataArray[index]}
                const down = {is: specialKeyPressed === 'ArrowDown', 
                    val : index < fullDataArray.length - 1 ? fullDataArray[index + 1] : fullDataArray[index]}
                const enter = {is: specialKeyPressed === 'Enter' && (hoveredData || fullDataArray.length === 1)}
                
                if(enter.is){
                    // let current = fullDataArray[0]
                    // if(fullDataArray.length > 1){
                    //     current = hoveredData ? hoveredData : fullDataArray[0]
                    // }

                    const current = hoveredData ? hoveredData : fullDataArray[0]
                    itemDoubleClickCondition(current) && itemDoubleClick(current)
                }else {
                    setHoveredData(up.is ? up.val : down.val)
                }
            }
        }, [specialKeyPressed]) //eslint-disable-line

        useEffect(() => {
            if(!lockHover){
                setHoveredData(null)
            }
        },[lockHover])

        useEffect(() => {
            (fullDataArray.length > 1 || fullDataArray.length === 0) && setHoveredData(null)
          }, [fullDataArray]) //eslint-disable-line

    return (
        <ListaContext.Provider value={{
            fullDataArray,
            selectedDataArray, setSelectedDataArray,

            itemDoubleClick, itemRightClick, 

            allowMultiSelect, specialKeys, 
            specialKeyPressed, setSpecialKeyPressed,

            hoveredData, setHoveredData,

            onConfirm, onItemClick, onRightClick,

            lockHover, setLockHover,

            grid: props.grid
            }} >
            {props.children}
        </ListaContext.Provider>
  )
}

export default ListaProvider;

export const useLista = () => {
    return useContext(ListaContext)
} 