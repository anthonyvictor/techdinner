import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  faClipboard,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageViewer from "./ImageViewer";

// import * as clip from 'clipboard-monitor'

import * as cores from '../context/cores'
import { loadImage } from "../util/misc";

function PictureBox(props) {
    const imgElement = useRef()


    function remove() {
        props.setImagem('')
    }
    
    


    const [showImageViewer, setShowImageViewer] = useState(false)

    function newImageViewer(){
        return(
        <ImageViewer 
        imagem={props.imagem}
        setImagem={props.setImagem}
        setShowImageViewer={setShowImageViewer}
        nome={props.nome}
         />)
    }


    // clip(500)

    // const clipMonit = require('clipboard-monitor');
 
    // //initialize & optionally set the interval with which to monitor the clipboard
     
    // var monitor = clipMonit(500);
     
    // /*
    // NOTE: interval defaults to 500ms so you can simply initialize using:
    //     'monitor = clipMonit()';
    // */
     
     
    // //now monitor your events...
     
    // //'copy. event is fired every time data is copied to the clipboard
    // monitor.on('copy', function (data) {
    //     //do something with the data
    //     console.log(data);
    // });
     
     
    // //Stop the monitoring the clipboard
    // useEffect(() => {return () => {monitor.end();}},[])





    
  return (
    <Container>
      <div className="img-container" 
      onTouchEnd={(e) => {if(props.imagem === ''){
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.onchange = _ => {
            let files = Array.from(input.files);
            props.setImagem(URL.createObjectURL(files[0]))
        }
        
        input.click();
       }else{
          setShowImageViewer(true)
      }}}>
       {props.imagem !== '' && <img ref={imgElement} src={props.imagem} alt="Imagem" />} 
      </div>
      

      <div className="botoes">

        <button type="button" id="carregar" onClick={(e) => {
          let input = document.createElement('input');
          input.type = 'file';
          input.accept = "image/*";
          input.onchange = _ => {
              let files = Array.from(input.files);
              props.setImagem(URL.createObjectURL(files[0]))
          }
          
          input.click();
        }}>
          <FontAwesomeIcon icon={faSearch} />
        </button>

        <button type="button" id="remover" onClick={(e) => remove()}
          disabled={props.imagem.length > 0 ? false : true}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <button type="button" id="colar">
          <FontAwesomeIcon icon={faClipboard} />
        </button>

      </div>

      {showImageViewer && newImageViewer()}

    </Container>
  );
}

export default PictureBox;

const Container = styled.div`
height: 100% ;
display: flex;
gap: 5px;
padding: 5px;

.img-container{
  height:100px;
  max-width: 100px;
  min-width: 100px;
  border: 1px solid black;
  background-color: white;
  img{
        width: 100%;
        height: 100%;
        
        /* flex-basis: 100px; */
        
        
        object-fit: cover;
    }
}

    .botoes{
        
    display: flex;
    flex-direction: column;
    flex-basis: 50px;
    gap: 1px;

        button{
            user-select: none;
            background-color: transparent; 
            outline: none;
            border: none;
            font-size: 18px;
            padding: 5px;
            flex-grow: 2;

            &:enabled:hover{
                cursor: pointer;
                color: ${cores.amarelo};
            }
        }
    }

  @media (max-width: 400px) {
    .botoes {
      display: none;
    }
  }
`;
