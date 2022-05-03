import React from "react";
import styled from "styled-components";
import { ToggleButton } from "../../../components/ToggleButton";
import { useEnderecos } from "../../../context/enderecosContext";
import * as Format from "../../../util/Format";
import { cores } from '../../../util/cores'
import { useCadEndereco } from ".";
import { isMobile, isNEU } from "../../../util/misc";

function EndLocCad() {
  const { bairros } = useEnderecos();

  const { 
    currEL, setCurrEL, limparEL, tiposEL, tipoEL, setTipoEL
 } = useCadEndereco()


 function ordem(a,b){
  if(a.taxa > b.taxa) return 1
  if(a.taxa < b.taxa) return -1
  // if(a.localeCompare(b))
  if(a.nome > b.nome) return 1
  if(a.nome < b.nome) return -1
}


  return (
    <Container>
      <div className={!isNEU(currEL.id) ? 'disabled' : undefined}>
        <div className="overlay" />
        <ToggleButton 
        items={tiposEL} currentItem={tipoEL} 
        setCurrentItem={setTipoEL} />
      </div>
      

      <form>
        <label>{isNEU(currEL.id) ? 'Novo!' : 'iD: ' + currEL.id }</label>

        <section>
          <label htmlFor="cep">CEP:</label>
          <input type={"tel"} 
          id="cep"
          name="cep"
          placeholder="00.000-000"
          value={currEL.cep}
          maxLength={9}
          autoFocus={!isMobile()}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9]/ig,'').trim()
            setCurrEL({...currEL, cep: Format.formatCEP(val)})
          }}
           />
        </section>

        <section className={tipoEL === "Local" ? "hidden" : undefined}>
          <label htmlFor="logradouro">Logradouro:</label>
          <textarea
            rows={2}
            id="logradouro"
            name="logradouro"
            placeholder="Rua.. Ladeira.. Avenida..."
            value={currEL.logradouro}
            onChange={(e) => setCurrEL({...currEL, logradouro: e.target.value})}
            onBlur={e => {e.target.value = e.target.value.trim()}}
         />
        </section>

        <section className={tipoEL === "Endereço" ? "hidden" : undefined}>
          <label htmlFor="local">Local:</label>
          <textarea
            rows={2}
            id="local"
            name="local"
            placeholder="Casa, Edifício, Apartamento, Condomínio, Hospital, Escola..."
            value={currEL.local}
            onChange={(e) => setCurrEL({...currEL, local: e.target.value})}
            onBlur={e => {e.target.value = e.target.value.trim()}}
          />
        </section>

        <section className={tipoEL === "Endereço" ? "hidden" : undefined}>
          <label htmlFor="numero">Número:</label>
          <input id="numero" name="numero"
          required placeholder="1600"
            value={currEL.numero ?? ''}
            onChange={(e) => setCurrEL({...currEL, numero: e.target.value})}
            onBlur={e => {e.target.value = e.target.value.trim()}}
             />
        </section>

        <section className={tipoEL === "Local" ? "hidden" : undefined}>
          <label htmlFor="bairro">Bairro:</label>
          <select id="bairro" name="bairro" required
          value={!isNEU(currEL.bairro) ? currEL.bairro : 'Selecione..'}
          onChange={(e) => setCurrEL({...currEL, bairro: e.target.value})}>
            <option key={0} disabled={true}>Selecione..</option>
            {bairros &&
              bairros
              .sort(ordem)
              .map((b) => (
                <option key={b.id}
                label={`${b.nome}, ${Format.formatReal(b.taxa)}`}>
                  {b.nome}</option>
              ))}
          </select>
        </section>

        <div className="botoes">
          <button type="button" id='salvar'>Salvar</button>
          <button type="button" id="limpar" onClick={() => limparEL(true)}>Limpar</button>
        </div>
      </form>
    </Container>
  );
}

export default EndLocCad;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 10px;
  overflow-y: auto;
  padding: 5px;
  background-color: ${cores.branco};
  height: 100%; 


  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-grow: 2;

    section {
      display: flex;
      flex-direction: column;
      label {
        display: block;
      }

      input, textarea, select {
        min-height: 50px;
        font-size: 18px;
        flex-grow: 2;
        text-transform: uppercase;
      }

      &.hidden {
      display: none;
    }
    }

    .botoes{
      display: flex;
      height: 50px;
      gap: 20px;

      button{
        border: 2px solid black;
        font-size: 18px;
        cursor: pointer;
      }

      #salvar{
        flex-grow: 3;
        background-color: ${cores.verde};
      }
      #limpar{
        flex-grow: 1;
        background-color: ${cores.vermelho};
      }
    }
    
  }

  .disabled{
    pointer-events: none;
    > *{
      opacity: 50%;
    }
  }

  @media (max-width: 550px) {
   
  }
`;
