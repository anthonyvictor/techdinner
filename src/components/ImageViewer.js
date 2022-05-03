// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowLeft,
//   faDownload,
//   faEllipsisV,
//   faSearch,
//   faShare,
//   faTrash,
// } from "@fortawesome/free-solid-svg-icons";
// import React, { useState } from "react";
// import styled from "styled-components";
// import { cores } from "../util/cores";
// import { loadImage, sleep } from "../util/misc";
// import { saveAs } from "file-saver";

// function ImageViewer(props) {
  
  //   async function fechar() {
    //     await sleep(50);
    //     props.setShowImageViewer(false);
    //   }
    
    //   const [contextMenu, setContextMenu] = useState(null);
    
    //   function openContext() {
      //     // return (
        //     //   <ContextMenu close={() => setContextMenu(null)}>
        //     //     <li
        //     //       className={props.showOp === false ? "disabled" : undefined}
        //     //       onClick={() => {
          //     //         loadImage(props.setImagem);
          //     //         setContextMenu(null);
          //     //       }}
          //     //     >
          //     //       <FontAwesomeIcon icon={faSearch} />
          //     //       <p>Carregar</p>
          //     //     </li>
          
          //     //     <li
          //     //       className={
            //     //         props.showOp === false || props.imagem === ""
            //     //           ? "disabled"
            //     //           : undefined
            //     //       }
            //     //       onClick={() => {
              //     //         props.setImagem("");
              //     //         setContextMenu(null);
              //     //         fechar();
              //     //       }}
              //     //     >
              //     //       <FontAwesomeIcon icon={faTrash} />
              //     //       <p>Remover</p>
              //     //     </li>
              
              //     //     <li className={props.imagem === "" ? "disabled hidden" : "hidden"}>
              //     //       <FontAwesomeIcon icon={faShare} />
              //     //       <p>Compartilhar</p>
              //     //     </li>
              
              //     //     <li
              //     //       className={props.imagem === "" ? "disabled" : undefined}
              //     //       onTouchStart={(e) => {
                //     //         let d = new Date()
                //     //           .toLocaleDateString("pt-br")
                //     //           .replace(/'[\s-:]'/, "");
                //     //         saveAs(props.imagem, props.nome + "-" + d);
                //     //         setContextMenu(null);
                //     //       }}
                //     //     >
//     //       <FontAwesomeIcon icon={faDownload} />
//     //       <p>Baixar</p>
//     //     </li>
//     //   </ContextMenu>
//     // );
//   }

//   return (
  //     <Container>
  //       <div className="nav">
  //         <span>
  //           <button type="button" onTouchEnd={(e) => fechar()}>
  //             <FontAwesomeIcon icon={faArrowLeft} />
  //           </button>
  //           <label>Imagem</label>
  //         </span>
  
  //         <button
  //           type="button"
  //           onClick={() => {
    //             setContextMenu(openContext());
    //           }}
    //         >
    //           <FontAwesomeIcon icon={faEllipsisV} />
    //         </button>
    //       </div>
    
    //       <div className="img-containerr">
    //         {props.imagem && <img src={props.imagem} alt="imagem" />}
    //       </div>
    
    //       {contextMenu}
    //     </Container>
    //   );
    // }
    
    // export default ImageViewer;
    
    // const Container = styled.div`
    //   display: flex;
    //   flex-direction: column;
    //   position: absolute;
    //   width: 100%;
    //   left: 0;
    //   top: 0;
    //   height: 100vmax;
    //   overflow: auto;
    //   background-color: ${cores.cinzaDark};
    //   color: white;
    
    //   button {
      //     width: 50px;
      //     height: 50px;
      //     font-size: 25px;
      //     color: white;
      //     background-color: transparent;
      //     outline: none;
      //     border: none;
      //   }
      
      //   .nav {
        //     display: flex;
        //     justify-content: space-between;
        //     font-size: 25px;
        //     padding: 10px;
        //     background-color: ${cores.dark};
        
        //     span {
          //       display: flex;
          //       gap: 10px;
          
          //       label {
            //         vertical-align: middle;
            //         line-height: 50px;
            //       }
            //     }
//   }

//   .img-containerr {
  //     flex-grow: 2;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     padding: 10px;
  
  //     img {
    //       min-width: 100%;
    //       object-fit: cover;
    //       background-color: white;
    //       /* width: 100hmin;  */
    //       height: 100vmin;
    //       /* aspect-ratio: 1; */
    //       box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
    //     }
    //   }
    // `;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    import React, { createContext, useContext, useEffect, useState } from 'react';
    import styled from 'styled-components';
    import { cores } from '../util/cores'
    // import { loadImage } from "../util/misc";
    // import { saveAs } from "file-saver";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import {faDownload, faSearch, faShare, faTrash,
    } from "@fortawesome/free-solid-svg-icons";

const ImageViewerContext = createContext()

export default function ImageViewerProvider({children}) {
    const [obj, setObj] = useState(null)
    const [component, setComponent] = useState(null)

    function fechar(e){
        if(e === true || e.target === e.currentTarget){
            setComponent(null);
            setObj(null)
        }
    }

    /**
     * 
     * @param {object} obj 
     * Objeto precisa coner as keys: 
     * {title: Nome da imagem, 
     * image: Imagem em base64,
     * setImage: função que altera a imagem
     */
    function imageView(_obj, event=null){
        if(event){event.preventDefault()}
       // _obj.title _obj.image / _obj.setImage
        setObj(_obj)
    }

    useEffect(() => {
            setComponent(obj ? <ImageViewer /> : null);
    }, [obj])
    return (
        <ImageViewerContext.Provider value={{obj, imageView, fechar}}>
            {children}
            {component}
        </ImageViewerContext.Provider>
    )
}

export const useImageViewer = () => {
    return useContext(ImageViewerContext)
}

function ImageViewer() {

    const {obj, fechar} = useImageViewer()
    const [image] = useState(obj.image)

    function carregar(){
      // loadImage(setImage);
      // if(obj.setImage) obj.setImage()
    }

    function remover(){
      // props.setImagem("");
      // setContextMenu(null);
      // fechar();
    }

    function compartilhar(){
      //
    }

    function baixar(){
      // let d = new Date()
      //   .toLocaleDateString("pt-br")
      //   .replace(/'[\s-:]'/, "");
      // saveAs(props.imagem, props.nome + "-" + d);
      // setContextMenu(null);
    }

    return (
      <Container onMouseDown={fechar}>
        <div className="image-viewer-container">
            
          <p className='titulo'>Imagem</p>

          <div className="img-containerr">
            {image && <img src={image} alt="imagem" />}
          </div>

          <div className='botoes'>
            <button
            disabled={!obj.setImage}
            onClick={() => carregar()}>
              <FontAwesomeIcon icon={faSearch} />
              <p>Carregar</p>
            </button>

            <button
            disabled={!obj.image}
            onClick={() => remover()}>
              <FontAwesomeIcon icon={faTrash} />
              <p>Remover</p>
            </button>

            <button
            disabled={!obj.image}
            onClick={() => compartilhar()}>
              <FontAwesomeIcon icon={faShare} />
              <p>Compartilhar</p>
            </button>

            <button
            disabled={!obj.image}
            onClick={() => baixar()}>
              <FontAwesomeIcon icon={faDownload} />
              <p>Baixar</p>
            </button>
          </div>

          <p className="rodape">TechDinner - Sistema de pedidos</p>
        </div>
      </Container>
    );
      
  }

const Container = styled.div`
    width: 100vw;
    height: 100%;
    position: absolute;
    z-index: 999;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;

    @keyframes aparecer{
        from{opacity: 0}
        to{opacity: 1}
    } 

    .image-viewer-container{
        width: min(80vw, 400px);
        max-height: 80vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: ${cores.branco};
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 2px 2px 10px rgba(0,0,0,.8);
        animation: aparecer .2s linear;
        gap: 5px;
        user-select: none;
        justify-content: center;

        .titulo{
            display: block;
            width: 100% ;
            text-align: center; 
            align-items: center;
            color: gray;
        }

        .botoes{
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100% ;
            height: 102px;
            grid-gap: 2px;
            margin-bottom: 10px;
            flex-shrink: 0;
            
            button{
                min-height: 50px;
                flex-grow: 2;
                background-color: ${cores.cinzaEscuro};
                *{color: white;}
                outline: none;
                border: 1px solid black;
                border-radius: 5px;
                font-size: 14px;

                &.disabled{
                    pointer-events: none;
                    background-color: ${cores.cinza};
                }

                &:not(.disabled):hover {
                    color: ${cores.amarelo};
                    cursor: pointer;
                }
            }
        }

        .img-containerr {
          flex-grow: 2;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
      
          img {
              min-width: 100%;
              object-fit: cover;
              background-color: white;
              border-radius: 10px;

              /* width: 100hmin;  */
              max-height: 100%;
              /* aspect-ratio: 1; */
            }
        }

        .rodape{
            width: 100% ;
            padding: 10px;
            border-top: 1px solid gray;
            text-align: center;
            font-size: 10px;
            color: gray;
            padding: 0 10px;
        }
    }
`