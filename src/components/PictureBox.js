import React, { useRef, useState } from "react";
import styled from "styled-components";
import {
  faClipboard,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageViewer from "./ImageViewer";
import { sleep } from '../util/misc';
import * as cores from '../context/cores'

function PictureBox(props) {

    const [imagem, setImagem] = useState(props.img)
    const imgElement = useRef()


    function remove() {
        setImagem('')
    }
    
    function load() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.onchange = _ => {
            let files = Array.from(input.files);
            setImagem(URL.createObjectURL(files[0]))
        };
        input.click();
    }


    const [showImageViewer, setShowImageViewer] = useState(false)

    function newImageViewer(){
        return(
        <ImageViewer 
        img={imagem} 
        close={() => async function(){
            await sleep(50)
            setShowImageViewer(false)
        }} />)
    }
    
  return (
    <Container>
      <img ref={imgElement} src={imagem} alt="Imagem"
      onTouchStart={(e) => imagem === '' ? setShowImageViewer(true) : load()} />

      <div className="botoes">

        <button type="button" id="carregar" onClick={(e) => load()}>
          <FontAwesomeIcon icon={faSearch} />
        </button>

        <button type="button" id="remover" onClick={(e) => remove()}
          disabled={imagem.length > 0 ? false : true}>
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

img{
        border: 1px solid black;
        background-color: white;
        flex-basis: 100px;
        height:100px;
        width: 100px;
        min-width: 100px;
        object-fit: cover;
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
    .buttons {
      display: none;
    }
  }
`;
