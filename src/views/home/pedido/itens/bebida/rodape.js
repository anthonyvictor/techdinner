import React from 'react'
import styled from 'styled-components'
import { useBebida } from '.'
import { useContextMenu } from '../../../../../components/ContextMenu'
import { useItens } from '../itens'
import * as cores from '../../../../../util/cores'
import { join } from '../../../../../util/misc'

export const Rodape = () => {

    const {item} = useItens()

    const {avancar, valor, setValor,
      observacoes, setObservacoes,
      qtd, setQtd} = useBebida()

    const {contextMenu} = useContextMenu()


    function openContextMenuObservacoes(){
        contextMenu([
          {title: 'Copos', click: addCopos},
          {title: 'Já levou', click: jaLevou},
        ])
      }

      function addCopos(){
        const sc = (t) => {setObservacoes(prev => join([prev,`${t} Copos`], ', '))}
        const resposta = prompt('Digite a quantidade de copos',2)
        if(resposta) sc(resposta)
      }

      function jaLevou(){
        setObservacoes(prev => join([prev,`JA LEVOU`], ', '))
      }

      function handleQtdInputChange(event){
        const novoValor = String(event.target.value)
        if(novoValor.replace(/[0-9]+/,'') === '') setQtd(Number(novoValor))

      }

    return (
        <Container>
            <div className='middle'>
                    <div className='valor'>
                      <label>Valor:</label>
                      <input type={'number'} min={0} step={0.5}
                      value={valor ?? 0}
                      onChange={e => setValor(e.target.value)} />
                    </div>

                    <div className='observacoes'>
                      <button onClick={openContextMenuObservacoes}>OBS</button>
                      <input
                      value={observacoes ?? ''}
                      onChange={e => setObservacoes(e.target.value)} />
                    </div>

                    <div className='qtd'>
                      <label>Qtd:</label>
                      <input type={'number'} min={1} step={1} 
                      value={qtd ?? 1} disabled={!!item?.bebida}
                      onChange={handleQtdInputChange} />
                    </div>
                </div>

                <button className='avancar' onClick={() => avancar()}>AVANÇAR</button>
        </Container>
    )
}

const Container = styled.div`
 flex-shrink: 0;
        /* height: 80px; */
        border-top: 1px solid black;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;

        .resumo {
            overflow-x: auto;
            width: 100%;
            text-align: center;
            flex-shrink: 0;
        }
        .middle {
          height: 30px;
          display: flex;
          gap: 10px;
          width: 100%;
          *{font-size: 16px;}

          button{padding: 0 5px;}
          .valor, .qtd{
            display: flex;;
            gap: 2px;
            align-items: center;
            

            input{
              width: 70px;
              height: 100%;
            }
            button{
              height: 100%;
              width: 40px;
              &.true{
                color: ${cores.vermelho};
              }
              &.false{
                color: ${cores.verde};
              }
            }
          }
          .observacoes{
            display: flex;
            flex-grow: 2;
            gap: 2px;
            input{
              flex-grow: 2;
              width: 100%;
            }
          }

          @media (max-width: 550px){
            flex-direction: column;
            height: 80px;
            gap: 2px;
            padding-top: 5px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;

            >.valor, .qtd{
              grid-row: 2;
              width: 100%;
              flex-grow: 2;
              justify-content: center;
              button{
                width: 60px;
              }
              input{
                flex-grow: 2;
              }
            }
            .observacoes{
              grid-column: 1 / span 2;
              width: 100%; 
              button{
                width: 80px;
              }
            }
          }

        }
        .avancar {
            min-height: 40px;
            flex-grow: 2;
            width: 60%;
            background-color: ${cores.verde};
            border: 2px solid black;
            border-radius: 5px;
            margin-top: 5px;
            @media (max-width: 550px){
              width: 100%;
              min-height: 50px;
            }
        }
`