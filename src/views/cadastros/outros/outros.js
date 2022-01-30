import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ListaProvider from '../../../context/listaContext';
import { Lista } from '../../../components/Lista';
import * as cores from '../../../util/cores'
import * as format from '../../../util/Format'
import * as misc from '../../../util/misc'
import PictureBox from '../../../components/PictureBox';
import { SearchBar } from '../../../components/SearchBar';
import { useOutros } from '../../../context/outrosContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassCheers, faIceCream } from "@fortawesome/free-solid-svg-icons";
import ImageViewer from '../../../components/ImageViewer';
import { useContextMenu } from '../../../context/contextMenuContext';

export const Outros = () => {
  const Empty = {
    id: 0, nome: '',
    imagem: '',
    tamanho: 0,
    valor: 0,
    ativo: true,
    visivel: true
}

    const {outros} = useOutros()
    const [search, setSearch] = useState("");
    const [imageView, setImageView] = useState(null);
    const [filtered, setFiltered] = useState([])
    const {contextMenu} = useContextMenu()
    const [curr, setCurr] = useState(null)
    const [lista, setLista] = useState(null)
    
    
    useEffect(() => {
        setFiltered(outros.filter(e => misc.filtro({...e, imagem: ''}, search)))
        }, [search]) //eslint-disable-line
    
    useEffect(() => {
      if (filtered) {
        setLista(filtered.map((e) => 
            <li key={e.id} >

                <label className={`item-ativo ${e.ativo ? 'true' : 'false'}`} ></label>

                <div className='inicio'>

                    <div className='img'>
                        {!misc.isNEU(e.imagem) 
                        ? <img src={e.imagem} /> 
                        : <FontAwesomeIcon className='icone' icon={faIceCream} />}
                    
                    </div>

                </div>

                <div className='centro'>
                    <label className='nome'>{e.nome} - {format.formatReal(e.valor)}</label>
                </div>
            </li>
            ))
      }
    }, [filtered])//eslint-disable-line
     
      function openContext(e) {
        contextMenu([
          {title: 'Editar', click:() => editar(e)},
          {title: 'Excluir', click:() => excluir(e)},
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

        <section className='nome-container'>
            <label htmlFor='nome'>{'Nome:'}</label>
            <input id='nome' name='nome' placeholder='bauru.. pastel.. sorvete...'
            value={(curr && curr.nome) ? curr.nome : ''}
            onChange={e => setCurr({...curr, nome: e.target.value})}
            />
          </section>

            <section className='valor-container'>
                <label htmlFor='valor'>Preço:</label>
                <input id='valor' name='valor' type={'number'} step={.5}
                value={(curr && curr.valor) ? curr.valor : 0}
                onChange={e => setCurr({...curr, valor: e.target.value})}
                />
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
    padding: 20px;
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
        height: 180px;
        width: 200px;
        flex-shrink: 0;
        transform: translateX(30px)
    }

    .valor-container{
        width: 100% ;
        input{
            width: 100%;
            flex-grow: 0;
            flex-shrink: 0;
        }
       
    }
  }
  @media (max-width: 400px){
    flex-direction: column;
    overflow-y: auto;
  }
`;