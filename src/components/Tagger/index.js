import { Container } from './style';
import React, {useRef, useState } from "react";
import { formatPhoneNumber, formatNumber } from '../../util/Format'
import { useContextMenu } from '../../context/contextMenuContext';
import * as apis from '../../apis' 
import * as msg from '../../util/Mensagens'


function Tagger(props) {
    const myInput = useRef()
    const {contextMenu} = useContextMenu()

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
                default:
                    break
            } 
            if(formattedVal === '') {
                alert('Valor inválido!')
            } else if(props.array.filter(item => props.tipo === 'tel' ? formatPhoneNumber(item) === formattedVal : item === formattedVal).length === 0){
               if((props.validate && props.validate(formattedVal)) || !props.validate){
                props.setArray([...props.array, formattedVal])
                props.setState('')
                 myInput.current.focus()
               }
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

    function edit(txt){
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

    function whatsappMessage(phoneNumber){
        if (phoneNumber !== "") {
          apis.sendWhatsAppMessage(`Olá, ${msg.Cumprimento()}`, phoneNumber);
        }
      }

    function openContext(e){
        contextMenu([
            {title: 'Editar', 
            click:() => edit(props.tipo === 'tel' ? formatNumber(e) : e), 
            enabled: true, visible: true},

            {title: 'Copiar', 
            text: e,
            enabled: true, visible: true},

            {title: 'Excluir', 
            click:() => remove(props.tipo === 'tel' 
            ? formatNumber(e) : e), 
            enabled: true, visible: true},

            {title: 'Mensagem', 
            click:() => whatsappMessage(e), 
            enabled: true, 
            visible: props.tipo === 'tel'},

            {title: 'Ligar', 
            click:() => {}, 
            enabled: false, 
            visible: props.tipo === 'tel'}
        ])
    }

    function onChangeHandler(e){
        let val = e.target.value
        switch (props.tipo){
            case 'tel':
                val = val.replace(/[^0-9-)(\s]/ig, "")
                break;
            case 'number':
                val = val.replace(/[^0-9]/ig, "")
                break;
            default:
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

  return (
  <Container className="Tagger" contextMenu='menuc'>
    <div>
        <button type="button" tabIndex={'-1'} onClick={(e) => {add()}}>+</button>
        <input id='txt' value={props.state} ref={myInput} type={props.tipo ? props.tipo : 'text'} 
        onChange={e => onChangeHandler(e)} 
        onKeyUp={e => onKeyUpHandler(e)}
        />
        <label htmlFor="txt">{props.label}:</label>
    </div>
    <ul className='array'>{props.array.map(i => 
    (
    <li key={i} 
            onClick={(e) => {
                openContext(e.target.innerHTML)
            }}
            
            onContextMenu={(e) => {
                e.preventDefault()
                openContext(e.target.innerHTML)
            }}

            >{props.tipo === 'tel'? formatPhoneNumber(i) : i}
        </li>
        ))}
    </ul>


        
    


  </Container>)
}

export default Tagger