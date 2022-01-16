import { Container } from './style';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useRef, useState } from "react";
import ContextMenu from '../contextMenu';
import { formatPhoneNumber, formatNumber } from '../../util/Format'
import { copiarParaClipboard } from '../../util/misc';
import CopyView from '../CopyView';


function Tagger(props) {

    // const [array, props.setArray] = useState(props.array ? props.array : [])
    // const [currTxt, setCurrTxt] = useState('')
    const myInput = useRef()
    const tagItem = useRef()


    function add(){
        if(props.tipo === 'tel' ? props.state.length >= 8 : props.state.length > 2){
            let formattedVal = props.state.trim()
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
            } else if(props.array.filter(item => props.tipo === 'tel' ? formatPhoneNumber(item) === formattedVal : item === formattedVal).length === 0){
               props.setArray([...props.array, formattedVal])

               props.setState('')
                myInput.current.focus()
            }else{
                alert('Valor já inserido!')

                props.setState('')
                myInput.current.focus()
            }

        }else{
            alert('Valor inválido!')
            myInput.current.focus()
        }
    }

    function remove(txt){
        if(window.confirm('Deseja excluir este item?')){
            props.setArray(props.array.filter(item => props.tipo === 'tel' ? formatPhoneNumber(item) !== formatPhoneNumber(txt) : item !== txt))
        }
    }

    function editar(txt){
        let liberado = true
        if(props.state.length > 2){
            if(!window.confirm('Deseja cancelar a edição atual?')){
                liberado = false
            }
        }
        if(liberado){
            props.setState(txt)
            props.setArray(props.array.filter(item => props.tipo === 'tel' ? formatPhoneNumber(item) !== formatPhoneNumber(txt) : item !== txt))
            myInput.current.focus()
        }
    }

    const [openMenu, setOpenMenu] = useState(false)
    const [currItem, setCurrItem] = useState(null)

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
        props.setState(val)
        
        // pattern={"[(][0-9]{2}[)]\s(9)[0-9]{4}-[0-9]{4}"}
    }

    function onKeyUpHandler(e){
        if(e.key === 'Enter' || e.key === 13){
            add()
        }
    }

    const [showCopyView, setShowCopyView] = useState(false)

  return (
  <Container className="Tagger" contextMenu='menuc'>
    <div>
        <button type="button" tabIndex={'-1'} onClick={(e) => {add()}}>+</button>
        <input id='txt' value={props.state} ref={myInput} type={props.tipo ? props.tipo : 'text'} 
        onChange={e => onChangeHandler(e)} 
        onKeyUp={e => onKeyUpHandler(e)}/>
        <label htmlFor="txt">{props.label}:</label>
    </div>
    <ul className='array'>{props.array.map(i => 
    (
    <li key={i} 
            onClick={(e) => {
                setCurrItem(e.target)
                setOpenMenu(!openMenu)
            }
        }>{props.tipo === 'tel'? formatPhoneNumber(i) : i}
        </li>
        ))}
    </ul>


    {openMenu && (
        <ContextMenu pos={currItem.getBoundingClientRect()}
        openMenu={openMenu} setOpenMenu={() => {
            setShowCopyView(false)
            setOpenMenu(false)
        }}>
            
            <li 
            onClick={() => 
                {
                    editar(props.tipo === 'tel' ? formatNumber(currItem.innerHTML) : currItem.innerHTML)
                    setOpenMenu(false)
                }
                }>
            Editar
            </li>

            <li 
            onTouchStart={(e) =>
            {
                e.preventDefault()
                setShowCopyView(true)
            }}
            onClick={() => 
                {
                    copiarParaClipboard(currItem.innerHTML)
                    setOpenMenu(false)
                }}>
            Copiar
            </li>

            <li 
            onClick={() => 
                {
                    remove(props.tipo === 'tel' ? formatNumber(currItem.innerHTML) : currItem.innerHTML)
                    setOpenMenu(false)
                }}>
                Excluir
            </li>

            <li className={props.tipo === 'tel' ? 'disabled' : 'hidden'}>
                Mensagem
            </li>

            <li  className={props.tipo === 'tel' ? 'disabled' : 'hidden'}>
                Ligar
            </li>

            {showCopyView && <CopyView txt={currItem.innerHTML} />}
        </ContextMenu>
    )}


  </Container>)
}

export default Tagger