import React, {createContext, useContext, useEffect, useState} from 'react';
import * as misc from '../util/misc'

const ListaContext = createContext()

function ListaProvider(props) {
    //lista, all, itemClick, itemContext, multi, marked, setMarked, eventsListener

    const {fullDataArray} = props
    const [selectedDataArray, setSelectedDataArray] = useState(props.selectedDataArray ?? [])
    const setResponseArray = props.setResponseArray ?? (() => {})
    const [hoveredData, setHoveredData] = useState(null)
    const {itemDoubleClick, itemRightClick} = props
    const allowMultiSelect = props.allowMultiSelect ?? false
    const allowKeyPressObserver = props.allowKeysObserver ?? true
    
    const specialKeys = ['ArrowDown', 'ArrowUp', 'Enter']
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

        function onPressValidator(event){
            if(event.type === 'keydown'){
              onPress(event.key, event.key)
            }else if(event.type === 'keyup'){
              onPress(event.key, null)
            }
          }

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
            }
          }

        function onRightClick(event, data){
            event.preventDefault()
            itemRightClick(data)
        }

        function getIndex(data){
            return data && fullDataArray.map(e => e.id).indexOf(data.id)
        }

        useEffect(() => {
            if (specialKeyPressed && fullDataArray.length > 0 && !focusBusy()) {

                let index = getIndex(hoveredData) ?? -1
                const up = {is: specialKeyPressed === 'ArrowUp', 
                    val : index > 0 ? fullDataArray[index - 1] : fullDataArray[index]}
                const down = {is: specialKeyPressed === 'ArrowDown', 
                    val : index < fullDataArray.length - 1 ? fullDataArray[index + 1] : fullDataArray[index]}
                const enter = {is: specialKeyPressed === 'Enter' && (hoveredData || fullDataArray.length === 1)}
                
                if(enter.is){
                    itemDoubleClick(hoveredData ?? fullDataArray[0])
                }else {
                    console.log(down.val)
                    setHoveredData(up.is ? up.val : down.val)
                }
            }
        }, [specialKeyPressed]) //eslint-disable-line

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