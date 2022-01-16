import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faEllipsisV, faSearch, faShare, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as cores from '../context/cores'
import { loadImage, sleep } from '../util/misc';
import ContextMenu from './contextMenu';
import { saveAs } from 'file-saver'

function ImageViewer(props) {

    async function fechar(){
          await sleep(50)
          props.setShowImageViewer(false)
      }

    const [showContext, setShowContext] = useState(false)

  return (
      <Container>
          <div className='nav'>
            <span>
                <button type='button' onTouchEnd={e => fechar()}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <label>Imagem</label>
            </span>

            <button type='button' onTouchEnd={e => {setShowContext(true)}}>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>

          </div>

          <div className="img-containerr">
            {props.imagem && (<img src={props.imagem} alt='imagem' />)}
          </div>


          {showContext && 
          (<ContextMenu 
          setOpenMenu={() => setShowContext(false)} 
          pos={0}>
                <li 
                className={props.showOp === false ? 'disabled' : ''}
                onTouchStart={() => {
                    let input = document.createElement('input');
                    input.type = 'file';
                    input.accept = "image/*";
                    input.onchange = _ => {
                        let files = Array.from(input.files);
                        props.setImagem((URL.createObjectURL(files[0])))
                        setShowContext(false)
                    };
                    
                    input.click();
                    
                    // props.setImagem(loadImage(props.imagem))
                    }}>
                    <FontAwesomeIcon icon={faSearch} />
                    <p>Carregar</p>
                </li>

                <li 
                className={props.showOp === false || props.imagem === '' ? 'disabled' : ''}
                onTouchStart={() => {
                    props.setImagem('')
                    setShowContext(false)
                    fechar()
                }}>
                    <FontAwesomeIcon icon={faTrash} />
                    <p>Remover</p>
                </li>

                <li 
                className={props.imagem === '' ? 'disabled hidden' : 'hidden'}>
                    <FontAwesomeIcon icon={faShare} />
                    <p>Compartilhar</p>
                </li>

                <li className={props.imagem === '' ? 'disabled' : ''}
                onTouchStart={e => {
                        saveAs(props.imagem, props.nome)
                        setShowContext(false)
                }}>
                    <FontAwesomeIcon icon={faDownload} />
                    <p>Baixar</p>
                </li>
            </ContextMenu>)}
          
      </Container>
  )
}

export default ImageViewer;


const Container = styled.div`

display: flex;
flex-direction: column;
position: absolute;
width: 100%;
left: 0;
top: 0;
height: 100vh;
background-color: ${cores.preto};
color: white;

button{
        width: 50px;
        height: 50px;
        font-size: 25px;
        color: white;
        background-color: transparent;
        outline: none;
        border: none;
    }

.nav{
    display: flex;
    justify-content: space-between;
    font-size: 25px;
    padding: 10px;
    background-color: ${cores.dark};

    span{
        display: flex;
        gap: 10px;

        label{
            vertical-align: middle;
            line-height: 50px;
        }
    }
}

.img-containerr{

    flex-grow: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    

    img{
    min-width: 100%;
    object-fit: cover;
    background-color: white;
    /* width: 100hmin;  */
    height: 100vmin;
    /* aspect-ratio: 1; */
    box-shadow: 0px 10px 20px rgba(0,0,0,.4)
}
}

`