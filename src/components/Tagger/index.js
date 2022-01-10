import { Container } from './style';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import ContextMenu from '../contextMenu';
import { formatPhoneNumber } from '../../util/Format'



function Tagger(props) {


    const [array, setArray] = useState(props.array ? props.array : [])
    // const [currTxt, setCurrTxt] = useState('')
    const myInput = useRef()
    const tagItem = useRef()


    function add(){
        if(props.tipo === 'tel' ? inputValue.length >= 8 : inputValue.length > 2){
            let formattedVal = inputValue.trim()
            switch(props.tipo){
                case 'tel':
                    formattedVal = formatPhoneNumber(formattedVal, true)
                    break;
                case 'number':
                    formattedVal = formatPhoneNumber(formattedVal, true)
                    break;
            } 
            if(formattedVal === '') {
                alert('Valor inválido!')
            } else if(array.filter(item => item === formattedVal).length === 0){
               setArray([...array, formattedVal])

               setInputValue('')
                myInput.current.focus()
            }else{
                alert('Valor já inserido!')

                setInputValue('')
                myInput.current.focus()
            }

        }else{
            alert('Valor inválido!')
            myInput.current.focus()
        }
    }

    function remove(txt){
        if(window.confirm('Deseja excluir este item?')){
            setArray(array.filter(item => item !== txt))
        }
    }

    function editar(txt){
        let liberado = true
        if(inputValue.length > 2){
            if(!window.confirm('Deseja cancelar a edição atual?')){
                liberado = false
            }
        }
        if(liberado){
            setInputValue(txt)
            setArray(array.filter(item => item !== txt))
            myInput.current.focus()
        }
    }

    const [openMenu, setOpenMenu] = useState(false)
    const [currItem, setCurrItem] = useState(null)
    const [inputValue, setInputValue] = useState('')

    function onChangeHandler(e){
        let val = e.target.value
        switch (props.tipo){
            case 'tel':
                val = val.replace(/[a-zA-Z]/ig, "")
                break;
            case 'number':
                val = val.replace(/[^0-9]/ig, "")
                break;
            default:
                val = val
                break;
        }
        setInputValue(val)
        
        // pattern={"[(][0-9]{2}[)]\s(9)[0-9]{4}-[0-9]{4}"}
    }

    function onKeyUpHandler(e){
        if(e.key === 'Enter' || e.key === 13){
            add()
        }
    }

  return (
  <Container className="Tagger" contextMenu='menuc'>
    <div>
        <button type="button" tabIndex={'-1'} onClick={(e) => {add()}}>+</button>
        <input id='txt' value={inputValue} ref={myInput} type={props.tipo ? props.tipo : 'text'} onChange={e => onChangeHandler(e)} onKeyUp={e => onKeyUpHandler(e)}/>
        <label htmlFor="txt">{props.label}:</label>
    </div>
    <ul className='array'>{array.map(i => (<li key={i} onClick={(e) => {
            setCurrItem(e.target)
            setOpenMenu(!openMenu)
        }}>{i}</li>))}
    </ul>


    {openMenu && (
        <ContextMenu pos={currItem.getBoundingClientRect()}
        openMenu={openMenu} setOpenMenu={() => setOpenMenu(false)}>
            
            <li onClick={() => editar(currItem.innerHTML)}>Editar</li>

            <li onClick={() => {navigator.clipboard.writeText(currItem.innerHTML)}}>Copiar</li>

            <li onClick={() => remove(currItem.innerHTML)}>Excluir</li>

            <li>Mensagem</li>

            <li>Ligar</li>
        </ContextMenu>
    )}


  </Container>)
}

export default Tagger