import { isNEU } from "./misc"
    export const MyDDD = () => {return '71'}
    export const MyCity = () => 'SALVADOR'
    export const MyStateCode = () => 'BA'
    export const MyState = () => 'BAHIA'
    
    
    export const GoogleApiKey = () => {return "AIzaSyCvwFjwFzMgH-ow_fzuWRKmO7ZdeLWLiak"}


    export const getStored = (value) => {
        return isNEU(localStorage.getItem(value)) ? '' : localStorage.getItem(value)
    }

    export const setStored = (key, value) => {
        const newValue = isNEU(value) ? '' : value
        localStorage.setItem(key, newValue)
    }

    