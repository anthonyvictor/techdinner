import React from "react";
import styled from "styled-components";
import Tagger from "../../../components/Tagger";
import { cores } from "../../../util/cores";
import PictureBox from "../../../components/PictureBox";
import * as Format from "../../../util/Format";
import { isMobile, isNEU } from "../../../util/misc";
import { useCadListaClientes } from '.'
import { useClientes } from "../../../context/clientesContext";
import Endereco from "./endereco";
import { useApi } from "../../../api";
import { useMessage } from "../../../components/Message";



export const CadastroCli = () => {
  const {clientes, refresh} = useClientes()
  const {api} = useApi()
  const { select, currentCliente, setCurrentCliente, clearForm, contato, setContato, tag, setTag } = useCadListaClientes()
  const {message} = useMessage()
  
  async function salvar() {
    let ctt = [...currentCliente?.contato.map(c => Format.formatNumber(c))]
    let tg = [...currentCliente?.tags]
    if(isNEU(currentCliente?.nome)){
      message('alert','Insira o nome do cliente')
    }else if(isNEU(currentCliente?.contato)){
      message('alert','Adicione um número para contato')
    }else{
      if(contato.length > 7){
        if(window.confirm(`Adicionar o número ${Format.formatPhoneNumber(contato)}?`)){
          if(checarCttExiste(contato)){
          ctt.push(Format.formatNumber( Format.formatPhoneNumber(contato, true) ))
          }else{return}
        }
      }
  
      if(!isNEU(tag)){
        if(window.confirm(`Adicionar a tag ${tag}?`)){
          tg.push(tag)
        }
      }
      const payload = {
        cliente: {
          ...currentCliente,
          nome: currentCliente?.nome.toUpperCase(),
          imagem: currentCliente?.imagem,
          contato: ctt,
          tags: tg,

        }
      }
      api().post('clientes/salvar', payload)
      .then((e) => {
          refresh(e.data)
          select(e.data)
      }).catch(e => {
        alert(`Erro: ${e} stack: ${e.stack}`)
      })
    }  
    

  }



  function checarCttExiste(txt){
    const jatem = clientes.filter(e => e.contato.some(x => Format.formatPhoneNumber(x) === Format.formatPhoneNumber(txt)))
    if(jatem.length > 0){
      alert(`Este número está vinculado a: (${jatem[0].id}) ${jatem[0].nome}`)
      return false
    }else{
      return true
    }
  }

//  function validateImage(){
//   let img = imagem
//  if(imagem){
//   if(typeof img === 'string' && img.includes('blob:')) {
//   }

//   if(typeof img === 'object') img = Format.convertImageToBase64(img)
//  }
//   return img
// }

  return (
    <Estilo className="cadastro-clientes">
      <div id="top-container">
        <div className="picturebox-container">
          <PictureBox imagem={currentCliente?.imagem ?? ''} nome={currentCliente?.nome}
          setImagem={newImagem => setCurrentCliente(prev => { return{...prev, imagem: newImagem}})}  />  
        </div>

        <div className="id-nome">
          <label>{currentCliente?.id > 0 ? `Id: ${currentCliente?.id}` : "Cliente Novo!"}</label>
          <div className="txt nome-section">
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoFocus={!isMobile()}
              value={currentCliente?.nome ?? ''}
              onChange={(e) => setCurrentCliente(prev => {return {...prev, nome: e.target.value}})}
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
              }}
            />
          </div>
        </div>
      </div>

      <div id="tags-container">
        <Tagger
          tipo="tel"
          label={"Contato"}
          state={contato}
          setState={setContato}
          array={currentCliente?.contato ? currentCliente?.contato : []}
          setArray={e => {
            setCurrentCliente(prev => {return {...prev, contato: e}})
          }}
          validate={checarCttExiste}
        />

        <Tagger
          label={"Apelidos"}
          state={tag}
          setState={setTag}
          array={currentCliente?.tags ? currentCliente?.tags : []}
          setArray={e => setCurrentCliente(prev => {return {...prev, tags: e}})}
        />
      </div>

      <Endereco endereco={currentCliente?.endereco} 
      setEndereco={(obj) => 
      setCurrentCliente(prev => {return {...prev, endereco: { ...prev?.endereco, ...obj }}})} />

      <section id="bottom-container">
        <button id="salvar" type="button" 
        onClick={() => salvar()}>
          Salvar
        </button>
        <button id="limpar" type="button" 
        onClick={() => {
          clearForm(true)
        }}>
          Limpar
        </button>
      </section>

      
    </Estilo>
  );
}

const Principal = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 5px;
  overflow-y: auto;
  /* position: relative; */
  width: 100% ;
  height: 100%;

  @keyframes aparecer{
    from{opacity: 0}
    to{opacity: 1}
  }

  #top-container {
    display: flex;
    width: 100%;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
    gap: 5px;
    height: 120px;

    .picturebox-container{
      width: 150px;
      height: 100% ;
      flex-grow: 0;
      flex-shrink: 0;
    }

    .id-nome {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;

      .txt {
        display: flex;
        user-select: none;

        gap: 5px;

        * {
          font-size: 16px;
        }

        input {
          flex-grow: 2;
        }
      }

      label {
        user-select: none;
      }

      .nome-section {
        height: 50px;
        width: 100%;
        flex-direction: column;
        gap: 2px;
      }
    }
  }

  #tags-container {
    display: flex;
    justify-content: stretch;
    gap: 20px;
    height: auto;

    .Tagger {
      width: 50%;
    }
  }

  #bottom-container {
    display: flex;
    min-height: 60px;
    gap: 30px;
    padding: 6px;
    flex-grow: 0;
    flex-shrink: 0;
    button {
      font-size: 20px;
      cursor: pointer;
      outline: none;
      border: 1.5px solid black;
    }
    #salvar {
      flex-grow: 3;
      background-color: ${cores.verde};
    }
    #limpar {
      flex-grow: 1;
      background-color: ${cores.vermelho};
    }
  }
`;

const Estilo = styled(Principal)`
  @media (max-width: 550px) {
    display: block;
    
    
    #top-container {
    display: flex;
    width: 100%;
    flex-basis: 120px;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 5px;
    gap: 5px;
    height: 120px;

    .picturebox-container{
      width: 110px;
      height: 100% ;
      flex-grow: 0;
      flex-shrink: 0;
    }

    .id-nome {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;

      

      .nome-section {
        height: 50px;
        width: 100%;
        flex-direction: column;
        gap: 2px;
      }
    }
  }


    & > :not(:last-child) {
      margin-bottom: 10px;
    }
    

    #tags-container {
      flex-direction: column;
      overflow-x: hidden;
      flex-shrink: 0;

      .Tagger {
        width: 100%;
      }
    }

    /* .txt {
      label {
        
        font-size: 16px;
      }
    } */



    .txt {
        display: flex;
        user-select: none;
        gap: 5px;
      
        * {
          font-size: 16px;
        }

        input {
          flex-grow: 2;
          width: 100%;
        }
      }

      label {
        user-select: none;
      }

  }
`;
