import React from 'react';
import styled from 'styled-components';
import { cores } from '../../../util/cores'
import * as misc from '../../../util/misc'

export const Cadastro = () => {

      function limpar(confirm) {
        const res = confirm && window.confirm("Limpar formulário?");
        if (res) {
            setCurr(null);
        }
      }

      function openSelectBoxCliente() {

      }

    return (
      <Container>
          <label>{curr && !misc.isNEU(curr.id) ? `iD: ${curr.id}` : 'Novo!' }</label>

        <section className='nome-container'>
            <label htmlFor='nome'>{'Nome:'}</label>
            <input id='nome' name='nome' placeholder='bauru.. pastel.. sorvete...'
            value={(curr && curr.nome) ? curr.nome : ''}
            onChange={e => setCurr({...curr, nome: e.target.value})}
            />
          </section>

            <section className='cliente-container'>
                <label htmlFor='cliente'>Cliente:</label>
                <button id='cliente' name='cliente'
                onClick={() => openSelectBoxCliente()}>
                    {(curr && curr.cliente.id) ? `${curr.cliente.id} - ${curr.cliente.nome}` : ''}
                </button>
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
      </Container>
    );
}

const Container = styled.form`
  background-color: ${cores.branco};
  width: 100%;
  height: 90%;
  display: flex;


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
`;