import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ListaProvider from '../../../context/listaContext';
import { Lista } from '../../../components/Lista';
import * as cores from '../../../util/cores'
import * as format from '../../../util/Format'
import * as misc from '../../../util/misc'
import PictureBox from '../../../components/PictureBox';
import { SearchBar } from '../../../components/SearchBar';
import { useBebidas } from '../../../context/bebidasContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassCheers } from "@fortawesome/free-solid-svg-icons";
import ImageViewer from '../../../components/ImageViewer';
import { useContextMenu } from '../../../context/contextMenuContext';

export const Bebidas = () => {
  const Empty = {
    id: 0, nome: '',
    imagem: '',
    tipo: '',
    sabor: '',
    tamanho: 0,
    valor: 0,
    ativo: true,
    visivel: true
}

    const {bebidas} = useBebidas()
    const [search, setSearch] = useState("");
    const [imageView, setImageView] = useState(null);
    const [filtered, setFiltered] = useState([])
    const {contextMenu} = useContextMenu()
    const [curr, setCurr] = useState(null)
    const [lista, setLista] = useState(null)
    
    
    useEffect(() => {
        setFiltered(bebidas.filter(e => misc.filtro({...e, imagem: ''}, search)))
        }, [search]) //eslint-disable-line
    
        useEffect(() => {
          if (filtered) {
            setLista(filtered.map((e) => 
                <li key={e.id} >

                    <label 
                    className={`item-ativo ${e.ativo ? 'true' : 'false'}`} ></label>

                    <div className='inicio'>

                        <div className='img'>
                            {!misc.isNEU(e.imagem) 
                            ? <img src={e.imagem} /> 
                            : <FontAwesomeIcon className='icone' icon={faGlassCheers} />}
                        
                        </div>

                    </div>

                    <div className='centro'>
                        <div>
                        <label className='nome'>
                          {[e.nome, e.sabor ? e.sabor : '', format.formatLitro(e.tamanho)]
                          .filter(e => e !== '')
                          .join(' ')}
                          </label>
                        {!e.visivel && <strong className={`item-visivel ${e.visivel
                        ? 'true' : 'false'}`}> - {e.visivel
                        ? 'Visível' : 'Invisível'}</strong>}
                        </div>
                        <div className='bottom'>
                            <span>Preço: {format.formatReal(e.valor)}</span>
                            <span> | Categoria: {e.tipo}</span>
                        </div>
                    </div>
                </li>
                ))
          }
        }, [filtered])//eslint-disable-line
     
      function openContext(e) {

        contextMenu([
          {title: 'Editar', click:() => editar(e), enabled: true, visible: true},
          {title: 'Excluir', click:() => excluir(e), enabled: true, visible: true}
        ])
      }
    
      function editar(e){  
        let preenchido = !misc.isNEU(misc.joinObj(curr))
    
        if ((preenchido && window.confirm("Deseja cancelar a edição atual?")) 
        || !preenchido) {
          setCurr(e)
        }
      }
    
      function excluir(e){}
    
      function limpar(confirm) {
        const res = confirm && window.confirm("Limpar formulário?");
        if (res) {
            setCurr(null);
        }
      }
      function itemClick(item){
        editar(item)
      }
    return (
      <Container>
        <div className="esq">
          <SearchBar value={search} setValue={setSearch} />

          <ListaProvider
            fullDataArray={filtered}
            itemDoubleClick={itemClick}
            itemRightClick={openContext}
          >
            <Lista>{lista}</Lista>
          </ListaProvider>
        </div>

        <form className="dir">
          <section className="picturebox-container">
            <PictureBox
              imagem={curr && curr.imagem ? curr.imagem : ""}
              nome={curr && curr.nome ? curr.nome : "bebida"}
              setImagem={(e) => setCurr({ ...curr, imagem: e })}
            />
          </section>

          <label>{curr && !misc.isNEU(curr.id) ? `iD: ${curr.id}` : 'Novo!' }</label>

          <section className='tipo-container'>
            <label htmlFor="tipo">Tipo:</label>
            <input id="tipo" name="tipo" 
            list='tipos-lista' placeholder='refrigerante.. cerveja..'
            value={(curr && curr.tipo) ? curr.tipo : ''}
            onChange={(e) => setCurr({...curr, tipo: e.target.value})} />
            <datalist id='tipos-lista'>
                {[...new Set(bebidas.map(e => e.tipo).filter(e => !misc.isNEU(e)))].map(e => (
                    <option key={e}>{e}</option>
                ))}
            </datalist>
        </section>

        <section className='nome-container'>
            <label htmlFor='nome'>{'Nome:'}</label>
            <input id='nome' name='nome' placeholder='pepsi.. antarctica.. schin..'
            value={(curr && curr.nome) ? curr.nome : ''}
            onChange={e => setCurr({...curr, nome: e.target.value})}
            />
          </section>

        <section className='sabor-container'>
            <label htmlFor='sabor'>Sabor:</label>
            <input id='sabor' name='sabor' 
            list='sabores-lista' placeholder='laranja.. cola..'
            value={(curr && curr.sabor) ? curr.sabor : ''}
            onChange={e => setCurr({...curr, sabor: e.target.value})}
            />
            <datalist id='sabores-lista'>
                {[...new Set(bebidas.map(e => e.sabor).filter(e => !misc.isNEU(e)))].map(e => (
                    <option key={e}>{e}</option>
                ))}
            </datalist>
          </section>

          <section className='visivel-ativo-container'>

<section className='visivel-container'>
  <label htmlFor="visivel">Visível:</label>
  <input id="visivel" name="visivel"
  type={'checkbox'}
  checked={curr ? (curr.visivel ?? true) : true}
  onChange={(e) => setCurr(prev => {return {...prev, visivel: e.target.checked}})}
  />
</section>

<section className='ativo-container'>
  <label htmlFor="ativo">Ativo:</label>
  <input id="ativo" name="ativo"
  type={'checkbox'}
  checked={curr ? (curr.ativo ?? true) : true}
  onChange={(e) => setCurr(prev => {return {...prev, ativo: e.target.checked}})}
  />
</section>

</section>

          <section className='valor-tamanho-container'>
            <section className='valor-container'>
                <label htmlFor='valor'>Preço:</label>
                <input id='valor' name='valor' type={'number'} step={.5}
                value={(curr && curr.valor) ? curr.valor : 0}
                onChange={e => setCurr({...curr, valor: e.target.value})}
                />
            </section>

            <section className='tamanho-container'>
                <label htmlFor='tamanho'>Tamanho:</label>
                <div className='bottom'>
                    <input id='tamanho' name='tamanho' type={'number'} step={50}
                    value={(curr && curr.tamanho) ? curr.tamanho : 0}
                    onChange={e => setCurr({...curr, tamanho: e.target.value})}
                    />
                    <label>ML</label>
                </div>
            </section>

          </section>

          <div className="botoes">
            <button type="button" id="salvar">
              Salvar
            </button>
            <button type="button" id="limpar" 
            onClick={() => limpar(true)}>
              Limpar
            </button>
          </div>
        </form>
      </Container>
    );
}

const Container = styled.div`
  background-color: ${cores.brancoEscuro};
  width: 100%;
  height: 100%;
  display: flex;

  .esq {
    border: 1px solid black;
    padding: 10px;
    flex-grow: 2;
    display: flex;
    flex-direction: column;

    .lista-component-li {
      user-select: none;
      .item-ativo {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        pointer-events: all;
        border: 2px solid black;

        &.true {
          background-color: ${cores.verde};
        }
        &.false {
          background-color: ${cores.vermelho};
        }
      }

      .img {
        display: flex;
        flex-direction: column;
        width: 40px;
        height: 100%;

        img {
          border-radius: 10%;
          border: 2px solid black;
          flex-grow: 0;
          flex-shrink: 0;
          height: 40px;
          object-fit: cover;
        }

        .icone{
            font-size: 30px;
            margin: auto; 
            width: 100% ;
        }
      }

      .centro{
          .nome{
              font-size: 17px;
              font-weight: 600;
          }
          .bottom{
              *{font-size: 13px;}
          }
      }
    }
  }

  .dir {
    width: 400px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 0 20px;
    width: 400px;

    section {
      width: 100%;
      display: flex;
      flex-direction: column;
      label {
        display: block;
      }
      input {
        flex-grow: 2;
        font-size: 20px;
        text-transform: uppercase;
        padding: 5px 0;
      }
    }

    > .botoes {
      display: flex;
      height: 50px;
      gap: 20px;
      width: 100%;
      flex-shrink: 0;

      button {
        border: 2px solid black;
        font-size: 18px;
        cursor: pointer;
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

    .picturebox-container{
        height: 140px;
        width: 160px;
        flex-shrink: 0;
        transform: translateX(30px)
    }


    .visivel-ativo-container {
      flex-direction: row;
      justify-content: flex-start;
      section {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        * {
          padding: 0;
        }
        gap: 5px;
        label {
          text-align: center;
        }
        input {
          flex-grow: 0;
          width: 20px;
          height: 20px;
        }
      }
    }

    .valor-tamanho-container{
        flex-direction: row;
        width: 100% ;
        gap: 10px;
        input{
            width: 100%;
            flex-grow: 0;
            flex-shrink: 0;
        }
        .valor-container{
            width: 80px;
        }
        .tamanho-container{
            width: 80px;
            .bottom{
                display: flex;
                align-items: center;
                gap: 5px;
            }
        }
    }
  }

  @media (max-width: 550px){
    flex-direction: column;
  }
`;