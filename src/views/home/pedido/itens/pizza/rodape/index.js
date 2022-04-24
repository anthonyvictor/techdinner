import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePizzas } from '../../../../../../context/pizzasContext';
import * as cores from '../../../../../../util/cores'
import { equals, isNEU, join } from '../../../../../../util/misc';
import { usePizza } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { useContextMenu } from '../../../../../../components/ContextMenu';
import useSound from "use-sound";
import valorBloqueadoSound from '../../../../../../sounds/valor_bloqueado.mp3';

export const Rodape = () => {

    const {
      observacoes, setObservacoes, valor, setValor, 
      tamanhoSelected, saboresSelected, getSaborId,
      isPriceLocked, setIsPriceLocked, getIngredientesDescritos,
      callback, item, isLoaded, 
      isSearchFocused
    } = usePizza()
    const { tamanhos, bordas, valores } = usePizzas()
    const { contextMenu } = useContextMenu()
    const [playValorBloqueado] = useSound(valorBloqueadoSound)

    const [saboresDescritos, setSaboresDescritos] = useState('')
    const [temBorda, setTemBorda] = useState(getTemBorda(String(item?.observacoes)))
    const [isFidelidade, setIsFidelidade] = useState(String(item?.observacoes))

    useEffect(() => {
        setSaboresDescritos(getSaboresDescritos())
    }, [saboresSelected])

    useEffect(() => {
        setTemBorda(getTemBorda(observacoes))
        setIsFidelidade(getIsFidelidade(observacoes))
      }, [observacoes])

    useEffect(() => {
      isLoaded && calculateValor()
    }, [tamanhoSelected, temBorda, saboresSelected, isFidelidade, isLoaded]) //quando mudar ou tamanho ou borda ou sabores


    function getTemBorda(obj){
      return obj.toUpperCase().includes('BORDA')
    }
    function getIsFidelidade(obj){
      return obj.toUpperCase().includes('FIDELIDADE')
    }

    function getBordaValor(){
        let r = 0
        if(temBorda && tamanhoSelected){
          const bt = bordas.filter(b => equals(b.tamanho.id, tamanhoSelected))
          if(bt.length > 0){
            r = bt[0].valor
          }
          }
          
          return r
    }
    function getTamanhoTipoValor(){
        let r = 0
        if(tamanhoSelected){
            const currTipos = [...new Set(saboresSelected.map(e=> e.tipo.id))]
            const tipoTamanhoValores = valores
            .filter(v => equals(v.tamanho.id, tamanhoSelected) && currTipos.includes(v.tipo.id)) //
            .sort((a,b) => a.valor > b.valor ? -1 : 1)
            
            if(tipoTamanhoValores.length > 0){
              r = tipoTamanhoValores[0].valor
            }
          }
          return r
    } 

    function calculateValor(){
      const resultado = getBordaValor() + (isFidelidade ? 0 : getTamanhoTipoValor())
      if(!isPriceLocked){
        setValor(resultado)
      }else if(resultado > 0 && (resultado !== item.valor) && isLoaded){
        playValorBloqueado()
      }
    }

    function openContextMenuObservacoes(){
        contextMenu([
        {title: 'Borda',
        click:() => {
            const sb = (t) => {setObservacoes(prev => join([prev,`Borda de ${t}`], ', '))}
            contextMenu([
            {title:'Cheddar',click:()=>sb('Cheddar')},
            {title:'Requeijão',click:()=>sb('Requeijão')},
            {title:'Meio a meio',click:()=>sb('Meio a meio')},
            {title:'Mussarela',click:()=>sb('Mussarela')}
            ])
        }},
        {title: 'Massa',
        click:() => {
            const sm = (t) => {setObservacoes(prev => join([prev,`Massa ${t}`], ', '))}
            contextMenu([
            {title:'Bem assada',click:()=>sm('bem assada')},
            {title:'Mais suculenta',click:()=>sm('mais suculenta')},
            {title:'Mais fina',click:()=>sm('mais fina')},
            {title:'Mais grossa',click:()=>sm('mais grossa')},
            {title:'De batata',click:()=>sm('De batata')}
            ])
        }},
        {title: 'Fatias',
        click:() => {
            const sf = (t) => {setObservacoes(prev => join([prev,`${t} Fatias`], ', '))}
            contextMenu([
            {title:'6',click:()=>sf(6)},
            {title:'8',click:()=>sf(8)},
            {title:'12',click:()=>sf(12)},
            {title:'Mais',click:()=>{sf(prompt('Digite a quantidade de fatias',16))}}
            ])
        }},
        {title: 'Fidelidade',
        click:() => {
            if(window.confirm('Deseja zerar o valor desta pizza? Somente valores adicionais serão mantidos.')){
              setObservacoes(prev => join([prev,`Fidelidade`], ', '))
            }
        }},
        ])
    }

    function getSaboresDescritos() {
        let r = ''
        let index = 0
        for (let s of saboresSelected) {
            let ingr = getIngredientesDescritos({...s, id: getSaborId(s.id)}, false)
            r = [r, `${index + 1} - ${join([s.nome, ingr], ', ')}`]
                .filter(e => e !== '')
                .join(', ')
            index++
        }
        return r
    }

    function avancar(){
      if(!tamanhoSelected){
        alert('Escolha o tamanho!')
      }else if (saboresSelected.length === 0){
        alert('Selecione ao menos um sabor!')
      }else{
        callback({
          ...item, 
          observacoes: observacoes,
          tipo: 0,
          valor: valor,
          pizza: {
            tamanho: tamanhos.find(e => equals(e.id, tamanhoSelected)) , 
            sabores: saboresSelected, 
          },
        })
      }
    }

  return (
    <Container className={`bottom${isSearchFocused ? ' hidden' : ''}`} >
        <p className='resumo'>{saboresDescritos}</p>
        <div className='middle'>
            <div className='valor'>
                <label htmlFor='valor'>Valor:</label>

                <input name='valor' id='valor' 
                type={'number'} min={0} step={0.5}
                value={valor} disabled={isPriceLocked}
                onChange={e => setValor(e.target.value)} />

                <button className={`trava ${isPriceLocked}`} 
                title='Bloqueia/desbloqueia valor para alteração'
                onClick={() => setIsPriceLocked(prev => !prev)}>
                    <FontAwesomeIcon icon={isPriceLocked ? faLock : faLockOpen} /> 
                </button>

            </div>

            <div className='observacoes'>
            <button onClick={() => openContextMenuObservacoes()}>OBS</button>
            <input
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)} />
            </div>
        </div>
        <button className='avancar' onClick={avancar}>AVANÇAR</button>
    </Container>
  )
}

const Container = styled.div`

        flex-shrink: 0;
        border-top: 1px solid black;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;

        @media (max-width: 550px){
          
        }

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
          .valor{
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

            .valor{
              width: 100%;
              flex-grow: 2;
              justify-content: center;
              button{
                width: 60px;
              }
              input{
                /* flex-grow: 2; */
              }
            }
            .observacoes{
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