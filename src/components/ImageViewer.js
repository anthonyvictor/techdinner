import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faEllipsisV, faSearch, faShare, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components';
import * as cores from '../context/cores'

function ImageViewer(props) {
    function menu(){
        return(
            <div>
                <button type='button' disabled={props.showOp === false} onTouchStart={e => props.close()}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>

                <button type='button' disabled={props.showOp === false || props.img === ''}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>

                <button type='button' disabled={props.img === ''}>
                    <FontAwesomeIcon icon={faShare} />
                </button>

                <button type='button' disabled={props.img === ''}>
                    <FontAwesomeIcon icon={faDownload} />
                </button>
            </div>
        )
    }

  return (
      <Container>
          <div className='nav'>
            <span>
                <button type='button' onTouchEnd={e => props.close()}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <label>Imagem</label>
            </span>

            <button type='button'>
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>

          </div>

          <div className='img-container'>
            {props.img && (<img src={props.img} />)}
          </div>
          
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

.img-container{

    flex-grow: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    

    img{
    aspect-ratio: 1;
    min-width: 100%;
    object-fit: cover;
    background-color: white;
    
}
}

`