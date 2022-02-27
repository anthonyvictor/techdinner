import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as Format from '../../util/Format'
import * as misc from '../../util/misc'
import * as cores from '../../util/cores'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

import { usePizzas } from '../../context/pizzasContext'

import { SearchBar } from '../../components/SearchBar'
import { useContextMenu } from '../../components/ContextMenu'

export default function Pizza({ item }) {
    const { contextMenu } = useContextMenu()
    const [selected, setSelected] = useState([])
    const { tamanhos, sabores, ingredientes, bordas, valores } = usePizzas()
    const [filtered, setFiltered] = useState([])
    const [search, setSearch] = useState('')
    const [lista, setLista] = useState([])
    const [hovered, setHovered] = useState(null)
    const [lock, setLock] = useState(false)

    const specialKeys = ['ArrowDown', 'ArrowUp', 'Enter']
    const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    const [specialKeyPressed, setSpecialKeyPressed] = useState(null)
    const [ingrLista, setIngrLista] = useState(false)

    function fecharIngrList() {
        document.addEventListener('keydown', onPressValidator)
        document.addEventListener('keyup', onPressValidator)
        setIngrLista(false)
        searchRef.current.focus()
    }
    function openContextMenuIngr(e) {
        contextMenu([
            { title: 'Pouco', click: () => checkUncheckIngr(e, 'Pouco') },
            { title: 'Bastante', click: () => checkUncheckIngr(e, 'Bastante') },
        ])
    }
    function checkUncheckIngr(e, tipoAdd) {
        if (!e.tipoAdd || tipoAdd.toUpperCase() !== 'COM') {
            setSelectedIngr(prev => [...prev.filter(i => i.id !== e.id), { ...e, tipoAdd: tipoAdd }])
        } else if (tipoAdd.toUpperCase() === 'COM' && e.tipoAdd.toUpperCase() === 'COM') {
            setSelectedIngr(prev => [...prev.filter(i => i.id !== e.id), { ...e, tipoAdd: 'Sem' }])
        } else {
            setSelectedIngr(prev => [...prev.filter(i => i.id !== e.id), { ...e, tipoAdd: tipoAdd }])
        }
    }

    function confirmarIngr(sabor) {
        if (selected.map(e => String(e.id)).includes(String(sabor.id))) {
            setSelected(prev => [
                ...prev.filter(e => !misc.equals(e.id, sabor.id)),
                { ...sabor, ingredientes: selectedIngr },
            ])
        } else {
            const s2 = { ...sabor, ingredientes: selectedIngr }
            checkUncheck(s2, true)
        }
        fecharIngrList()
    }

    const [selectedIngr, setSelectedIngr] = useState([])
    const [searchIngr, setSearchIngr] = useState('')
    const [filteredIngr, setFilteredIngr] = useState([])

    useEffect(() => {
        const all = ingredientes.filter(e => selectedIngr.map(s => s.id).includes(e.id) === false)
        setFilteredIngr([...selectedIngr, ...all].filter(e => misc.filtro({ nome: e.nome }, searchIngr)))
    }, [searchIngr, selectedIngr])

    function abrirIngrLista(sabor) {
        document.removeEventListener('keydown', onPressValidator)
        document.removeEventListener('keyup', onPressValidator)
        setSelectedIngr(sabor.ingredientes.map(e => (!e.tipoAdd ? { ...e, tipoAdd: 'Com' } : e)))
        setIngrLista(sabor)
    }

    const order = (a, b) => {
        if(String(a.id).includes('s')) return -1
        if(String(b.id).includes('s')) return 1
        if (a.numero > b.numero) return 1
        if (a.numero < b.numero) return -1
        if (a.numero === b.numero) return 0
    }
    useEffect(() => {
        setFiltered(sabores.filter(filtroVisivel).filter(e => misc.filtro({ nome: e.nome, numero: e.numero }, search)))
    }, [search])

    useEffect(() => {
        setLista(
            [...selected, ...filtered.filter(filtroVisivel)]
                .filter(e => misc.filtro({ nome: e.nome, numero: e.numero }, search))
                .sort(order)
        )
    }, [filtered, selected])
const [lockHover, setLockHover] = useState(false)
    useEffect(() => {
            setLockHover(true)
    }, [lista])

    useEffect(() => {
        document.addEventListener('keydown', onPressValidator)
        document.addEventListener('keyup', onPressValidator)
        return () => {
            document.removeEventListener('keydown', onPressValidator)
            document.removeEventListener('keyup', onPressValidator)
        }
    }, []) //eslint-disable-line
    const onPressValidator = useCallback(event => {
        if (event.type === 'keydown') {
            if (
                [...alphaNum, 'BACKSPACE'].some(e => e === event.key.toUpperCase()) &&
                document.activeElement !== searchRef.current && !focusBusy()
            ) {
                searchRef.current.focus()
            } else {
                onPress(event.key, event.key)
            }
        } else if (event.type === 'keyup') {
            onPress(event.key, null)
            if (currLi.current && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                currLi.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [])

    function onPress(key, value) {
        if (specialKeys.some(e => e === key)) {
            setSpecialKeyPressed(value)
        }
    }

    function focusBusy() {
        let focusedElement = document.activeElement
        let isInput = focusedElement.nodeName.toLowerCase() === 'input'
        let isNotSearch = focusedElement.getAttribute('type') !== 'search'
        return isInput && isNotSearch
    }
    useEffect(() => {
        if (specialKeyPressed && lista.length > 0 && !focusBusy()) {
            let index = hovered ? lista.map(e => e.id).indexOf(hovered.id) : -1
            const up = { is: specialKeyPressed === 'ArrowUp', val: index > 0 ? lista[index - 1] : lista[index] }
            const down = {
                is: specialKeyPressed === 'ArrowDown',
                val: index < lista.length - 1 ? lista[index + 1] : lista[index],
            }
            const enter = { is: specialKeyPressed === 'Enter' && (hovered || lista.length === 1) }

            if (enter.is) {
                let current = lista[0]
                if(lista.length > 1){
                    current = hovered ? hovered : lista[0]
                }
                current.ativo && checkUncheck(current, !String(current.id).includes('s'))
            } else {
                setHovered(up.is ? up.val : down.val)
            }
        }
    }, [specialKeyPressed]) //eslint-disable-line

    function filtroVisivel(e) {
        return e.visivel
    }

    function openContext(e) {
        contextMenu([
            { title: 'Editar', click: () => abrirIngrLista(e) },
            { title: 'Ativar/Desativar', click: () => {} },
            { title: 'Remover', click: () => checkUncheck(e, false), enabled: String(e.id).includes('s') },
        ])
    }
    const [selectedAdded, setSelectedAdded] = useState(0)
    const listaRef = useRef()

    function checkUncheck(e, check, index=null) {
        if (check) {
            let newE = { ...e, id: String(e.id).split('s')[0] + 's' + (index ? index : selectedAdded + 1) }
            setSelected(prev => [...prev, newE])
            setSelectedAdded(prev => prev + 1)
        } else {
            setSelected(prev => prev.filter(p => !misc.equals(p.id, e.id)))
        }
        setSearch('')
        searchRef.current.focus()
    }

    function getSaboresDescritos() {
        let r = ''
        let index = 0
        for (let s of selected) {
            let ingr = getIngredientesDescritos(s, false)
            r = [r, `${index + 1} - ${[s.nome, ingr].filter(e => e !== '').join(', ')}`]
                .filter(e => e !== '')
                .join(', ')
            index++
        }
        return r

        // const joinTipoAdd = (ingredientes) => ingredientes.map(i => i.tipoAdd).join('')
        // const getIngredientesDiferentes = (ingredientes) => ingredientes.filter(i => i.tipoAdd !== '').map(i => `${i.tipoAdd} ${i.nome}`).join(', ')

        // let saboresDiferentes = sabores.filter(e => joinTipoAdd(e.ingredientes) !== '')
        // let outrosSabores = sabores.filter(e => joinTipoAdd(e.ingredientes) === '')
        // let r = saboresDiferentes.map(e => `${e.nome} (${getIngredientesDiferentes(e.ingredientes)})`).join(quebra)
        // r = [r, outrosSabores.map(e => e.nome).join(quebra)].filter(e => e !== '').join(quebra)
        // return r
    }

    function getIngredientesDescritos(sabor, tudo = true) {
        let r = ''

        const joinTipoAdd = sabor.ingredientes.map(i => i.tipoAdd ?? '').join('')
        if (joinTipoAdd !== '') {
            let diferentes = sabor.ingredientes.filter(i => i.tipoAdd && i.tipoAdd !== '')
            let saborOriginal = sabores.filter(s => String(s.id) === String(sabor.id).split('s')[0])[0]
            for (let dif of diferentes) {
                let difTipoAdd = dif.tipoAdd.toUpperCase()
                if (['POUCO','BASTANTE'].includes(difTipoAdd)) {
                    r = [r, `${dif.tipoAdd} ${dif.nome}`].filter(s => s !== '').join(', ')
                } else {
                    let ingrOriginais = saborOriginal.ingredientes.map(e => e.id)
                    let tem = ingrOriginais.includes(dif.id)
                    if ((!tem && difTipoAdd === 'COM') || (tem && difTipoAdd === 'SEM')) {
                        r = [r, `${dif.tipoAdd} ${dif.nome}`].filter(s => s !== '').join(', ')
                    }
                }
            }
            r = r === '' && tudo ? saborOriginal.ingredientes.map(e => e.nome).join(', ') : r
        } else {
            r = tudo ? sabor.ingredientes.map(e => e.nome).join(', ') : ''
        }
        // const getIngredientesDiferentes = sabor.ingredientes.filter(i => i.tipoAdd && i.tipoAdd !== '').map(i => `${i.tipoAdd} ${i.nome}`).join(', ')

        // let r = saboresDiferentes.map(e => `${e.nome} (${getIngredientesDiferentes(e.ingredientes)})`).join(quebra)
        // r = [r, outrosSabores.map(e => e.nome).join(quebra)].filter(e => e !== '').join(quebra)
        return r
    }
    const currLi = useRef()
    const searchRef = useRef()
    const [valor, setValor] = useState(0)
    const [observacoes, setObservacoes] = useState(item && item.observacoes ? item.observacoes : '')
    const [tamanho, setTamanho] = useState(item && item.pizza.tamanho ? item.pizza.tamanho : null)
    const [filteredTam] = useState([...tamanhos].filter(filtroVisivel))
    const [borda, setBorda] = useState(null)
    useEffect(() => {
      setBorda(observacoes.toUpperCase().includes('BORDA'))
    }, [observacoes])
    useEffect(() => {
      let valBorda = 0
      if(borda && tamanho){
        const bt = bordas.filter(b => b.tamanho.id === tamanho.id)
        if(bt.length > 0){
          valBorda = bt[0].valor
        }
      }
      let valTamTipo = 0 
      if(tamanho){
        const currTipos = [...new Set(selected.map(e=> e.tipo.id))]
        const valoresTipoTamanho = valores
        .filter(v => v.tamanho.id === tamanho.id && currTipos.includes(v.tipo.id))
        .sort((a,b) => a.valor > b.valor ? -1 : 1)
        if(valoresTipoTamanho.length > 0){
          valTamTipo = valoresTipoTamanho[0].valor
        }
      }
        if(!lock){
          setValor(valBorda + valTamTipo)
        }
    }, [tamanho, borda, selected]) //quando mudar ou tamanho ou borda ou sabores

    useEffect(() => {
        if(item && item.pizza){
            setLock(true)
            setValor(item.valor)
            let index = 0
            if(item.pizza.sabores){
                for(let sabor of item.pizza.sabores){
                    checkUncheck(sabor, true, index + 1)
                    index +=1
                }
            }
        }

    },[item])
    useEffect(() => {
        if(!lockHover){
            setHovered(null)
        }
    },[lockHover])
    return (
        <Container className='container pizza'>
            <select className='tamanho' defaultValue={tamanho ?? 'Selecione o tamanho...'}
            onChange={(e) => {
              setTamanho(tamanhos.filter(t => misc.equals(t.id, e.target.value))[0])}}>
                <option key={0} disabled>
                    Selecione o tamanho...
                </option>
                {tamanho && filteredTam.filter(t => t.id === tamanho.id).length === 0 &&
                  <option disabled value={tamanho.id} key={tamanho.id}>{tamanho.nome}</option>
                }
                {filteredTam.map(e => (
                    <option value={e.id} key={e.id} disabled={!e.ativo}>
                        {e.nome}
                    </option>
                ))}
            </select>
            <div className='middle'>
                <SearchBar _ref={searchRef} value={search} setValue={setSearch} />
                <ul className='lista-sabores' ref={listaRef}
                onMouseLeave={() =>setHovered(null)}>
                    {lista.map(e => {
                        return (
                            <li
                                ref={hovered && misc.equals(hovered.id, e.id) ? currLi : undefined}
                                key={e.id}
                                className={`sabor ${hovered && misc.equals(hovered.id, e.id) ? ' ativo' : ''}
                                ${selected.some(s => misc.equals(s.id, e.id)) ? ' selecionado' : ''}
                                ${(e.ativo === false) ? ' inactive' : ''}`}
                                onDoubleClick={() => abrirIngrLista(e)}
                                onMouseEnter={() => !lockHover && setHovered(e)}
                                onMouseLeave={() => setLockHover(false)}
                                onContextMenu={event => {
                                    event.preventDefault()
                                    openContext(e)
                                }}
                            >
                                <div className='inicio'>
                                    <p className='numero'>{e.numero 
                                    ?? sabores.filter(s => String(s.id) === String(e.id).split('s')[0])[0].numero}º</p>
                                    <input
                                        type={'checkbox'}
                                        defaultChecked={selected.some(s => misc.equals(s.id, e.id))}
                                        onChange={event => {
                                            if (event.target.checked) {
                                                checkUncheck(e, true)
                                                event.target.checked = false
                                            } else {
                                                checkUncheck(e, false)
                                            }
                                        }}
                                    ></input>
                                </div>
                                <div className='centro'>
                                    <section>
                                        <span className='tipo' style={{ color: e.tipo.cor }}>{`(${Format.formatAbrev(
                                            e.tipo.nome
                                        )}) `}</span>
                                        <span className='nome'>{e.nome}</span>
                                    </section>
                                    <p>{getIngredientesDescritos(e)}</p>
                                    {/* <p>{e.ingredientes.map(e => e.nome).join(', ')}</p> */}
                                </div>
                                <button className='botao' onClick={() => openContext(e)}>
                                    <FontAwesomeIcon icon={icons.faEllipsisV} />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className='bottom'>
                <p className='resumo'>{getSaboresDescritos()}</p>
                <div className='middle'>
                    <div className='valor'>
                      <label>Valor:</label>
                      <input type={'number'} min={0} step={0.5}
                      value={valor} disabled={lock}
                      onChange={e => setValor(e.target.value)} />
                      <button className={`trava ${lock}`} 
                      title='Bloqueia/desbloqueia valor para alteração'
                      onClick={() => setLock(prev => !prev)}>
                          {lock 
                          ? <FontAwesomeIcon icon={icons.faLock} /> 
                          : <FontAwesomeIcon icon={icons.faLockOpen} />}
                      </button>
                    </div>

                    <div className='observacoes'>
                      <button onClick={() => {
                        contextMenu([
                          {title: 'Borda',
                          click:() => {
                            const sb = (t) => {setObservacoes(prev=>[prev,`Borda de ${t}`].filter(e=>e!=='').join(', '))}
                            contextMenu([
                              {title:'Cheddar',click:()=>sb('Cheddar')},
                              {title:'Requeijão',click:()=>sb('Requeijão')},
                              {title:'Meio a meio',click:()=>sb('Meio a meio')},
                              {title:'Mussarela',click:()=>sb('Mussarela')}
                            ])
                          }},
                          {title: 'Massa',
                          click:() => {
                            const sm = (t) => {setObservacoes(prev=>[prev,`Massa ${t}`].filter(e=>e!=='').join(', '))}
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
                            const sf = (t) => {setObservacoes(prev=>[prev,`${t} Fatias`].filter(e=>e!=='').join(', '))}
                            contextMenu([
                              {title:'6',click:()=>sf(6)},
                              {title:'8',click:()=>sf(8)},
                              {title:'12',click:()=>sf(12)},
                              {title:'Mais',click:()=>{sf(prompt('Digite a quantidade de fatias',16))}}
                            ])
                          }},
                          {title: 'Fidelidade',
                          click:() => {
                            setObservacoes(prev=>[prev,`Fidelidade`].filter(e=>e!=='').join(', '))
                          }},
                        ])
                      }}>OBS</button>
                      <input
                      value={observacoes}
                      onChange={e => setObservacoes(e.target.value)} />
                    </div>
                </div>
                <button className='avancar'>AVANÇAR</button>
            </div>
            {ingrLista && (
                <IngrListContainer onClick={e => e.currentTarget === e.target && fecharIngrList()}>
                    <div className='center-container'>
                        <SearchBar value={searchIngr} setValue={setSearchIngr} />
                        <ul className='ingredientes-lista'>
                            {filteredIngr.map(e => (
                                <li
                                    key={e.id}
                                    className={`ingrediente${
                                        e.tipoAdd ? ` ${String(e.tipoAdd).toLocaleLowerCase()}` : ''
                                    }`}
                                    onContextMenu={event => {
                                        event.preventDefault()
                                        openContextMenuIngr(e)
                                    }}
                                    onClick={() => checkUncheckIngr(e, 'Com')}
                                >
                                    <div className='centro'>
                                        <label>{e.nome}</label>
                                    </div>
                                    <div className='fim'>
                                        <button className='option-ingrediente' onClick={() => openContextMenuIngr(e)}>
                                            <FontAwesomeIcon icon={icons.faEllipsisV} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className='confirmar' onClick={() => confirmarIngr(ingrLista)}>
                            AVANÇAR
                        </button>
                    </div>
                </IngrListContainer>
            )}
        </Container>
    )
}

const IngrListContainer = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .center-container {
        background-color: ${cores.branco};
        width: min(350px, 80%);
        height: min(600px, 80%);
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        gap: 5px;

        .ingredientes-lista {
            gap: 5px;
            display: flex;
            flex-direction: column;
            flex-grow: 2;
            flex-shrink: 2;
            padding-bottom: 2px;
            min-height: 50px;
            overflow: auto;

            .ingrediente {
                border: 1px solid black;
                padding: 5px;
                display: flex;
                align-items: center;
                min-height: 40px;
                cursor: pointer;

                label {
                    pointer-events: none;
                    user-select: none;
                }

                &.com {
                    background-color: ${cores.verde};
                }
                &.pouco {
                    background-color: ${cores.vermelho};
                }
                &.bastante {
                    background-color: ${cores.amarelo};
                }
                &:hover {
                    font-weight: 600;
                }
                .centro {
                    flex-grow: 2;
                }
                .fim {
                    height: 100%;
                    button {
                        height: 100%;
                        width: 60px;
                    }
                }
            }
        }
        .confirmar {
            flex-basis: 50px;
            flex-shrink: 0;
            flex-grow: 0;
            background-color: ${cores.verde};
            border: 1px solid black;
        }
    }
`

const Container = styled.div`
    width: 90%;
    height: 90%;
    @media (max-width: 550px){
        height: 80%;
    }
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    gap: 2px;

    select {
        width: 100%;
        padding: 10px;
        font-size: 22px;
        flex-grow: 0;
        flex-shrink: 0;
    }

    > .middle {
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 50px;
        .lista-sabores {
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-height: 50px;
            width: 100%;

            @media (min-width: 550px) {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-auto-rows: max-content;
                row-gap: 5px;
                column-gap: 5px;
            }

            overflow-y: auto;
            height: 100%;

            .sabor {
                display: flex;
                align-items: center;
                padding: 5px;
                gap: 5px;
                border: 1px solid black;
                background-color: ${cores.brancoEscuro};
                flex-basis: 70px;

                * {
                    pointer-events: none;
                }
                .inicio {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;

                    .numero {
                        font-size: 10px;
                        font-style: italic;
                    }
                    input {
                        pointer-events: all;
                        width: 30px;
                        height: 30px;
                        cursor: pointer;
                    }
                }
                .centro {
                    flex-grow: 2;

                    span {
                        font-weight: 600;
                        font-size: 17px;
                    }

                    p {
                        font-size: 13px;
                        font-weight: 600;
                    }
                }
                button {
                    background-color: transparent;
                    border: none;
                    outline: none;
                    font-size: 20px;
                    padding: 5px 15px;
                    cursor: pointer;
                    pointer-events: fill;
                }
                &.ativo {
                    background-color: ${cores.cinzaEscuro};
                    * {
                        color: white;
                    }
                }
                &.selecionado {
                    background-color: ${cores.verde};
                    * {
                        color: white;
                    }
                    &.ativo {
                        background-color: lime;
                    }
                }
                &.inactive{
                    pointer-events: none;
                    input{pointer-events: none;}
                    button{pointer-events: none;}
                    *{pointer-events: none;}
                    *{color: gray}
                }
            }
        }
    }

    .bottom {
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
    }
`
