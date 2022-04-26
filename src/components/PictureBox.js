import React, { useState } from "react";
import styled from "styled-components";
import { faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useImageViewer } from "./ImageViewer";
import * as cores from '../util/cores'
import { isNEU, loadImage } from "../util/misc";
import * as Format from '../util/Format'

function PictureBox(props) {

  function remove() {
        props.setImagem('')
    }

    const { imageView } = useImageViewer()

    function openImageViewer(){
      imageView({
        title: props.nome,
        image: props.imagem,
        setImage: props.setImagem
      })
    }
    const [showDragArea, setShowDragArea] = useState(false)

    function handleDragEnter(e){
      e.preventDefault()
      setShowDragArea(true)
    }

    function handleDragLeave(e){
      e.preventDefault()
      setShowDragArea(false)
    }

    function handleDragOver(e){
      e.preventDefault()
    }

    function handleOnDrop(e){
      e.preventDefault()
      const files = e.dataTransfer.files;
      for(let file of files){
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          if(file.size && file.type.startsWith('image')){
            props.setImagem(e.target.result)
          }
        }
      }
      setShowDragArea(false)
    }

    function openOrLoadImage(){
      isNEU(props.imagem) ? 
      loadImage(props.setImagem) :  
      openImageViewer()
    }

    const renderDropAreaElement = () => {
      return <div className="drop-area" />
    }

    const renderImageElement = () => {
      return <img src={props.imagem} alt="Imagem" />
    }

  return (
    <Container>
      <div className="img-container" 
      onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
      onDragOver={handleDragOver} onDrop={handleOnDrop}
      onTouchEnd={openOrLoadImage}>
        {showDragArea && renderDropAreaElement()}
        {props.imagem && renderImageElement()} 
      </div>
      

      <div className="botoes">

        <button type="button" id="carregar" 
        onClick={(e) => {loadImage(props.setImagem)}}>
          <FontAwesomeIcon icon={faSearch} />
        </button>

        <button type="button" id="remover" 
        onClick={(e) => remove()}
        disabled={props.imagem ? props.imagem.length > 0 ? false : true : false}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

    </Container>
  );
}

export default PictureBox;

const Container = styled.div`
height: 100% ;
width: 100% ;
display: flex;
gap: 5px;
padding: 5px;

.img-container{
  height: 100%;
  flex-basis: 150px;
  flex-grow: 0;
  border: 1px solid black;
  background-color: white;
  position: relative;

  .drop-area{
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(256,256,256,.8);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;

    &::after{
      content: 'Solte para colar';
      text-align: center;
      font-size: 20px;
    }
  }

  img{
        z-index: -999;
        /* pointer-events: none; */
        user-select: none;
        width: 100%;
        height: 100%;
        object-fit: scale-down;
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

  @media (max-width: 550px) {
    .botoes {
      display: none;
    }
  }
`;
