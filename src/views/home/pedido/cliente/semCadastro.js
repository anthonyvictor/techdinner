import React, {useState} from "react";
import { useHome } from "../../../../context/homeContext";
import { isMobile } from "../../../../util/misc";

export const SemCadastro = ({callback}) => {

    const { curr } = useHome()
    const [nome, setNome] = useState(curr?.cliente?.nome || '')

    function confirmarNome(event) {
        event.preventDefault()
        if(nome.length > 2){
            callback({nome: nome})
        }else{
            alert('Digite um nome válido!')
        }
    }

    function atualizarNome(event){
        setNome(event.target.value)
    }
    return (
        <form className='container semcadastro'>

          <h4 className='titulo'>Informe o nome do cliente, lembrando que este método serve 
            apenas para identificar o pedido, e não é válido como cadastro!</h4>

          <input type={'text'} className='nome' required={true} 
          autoFocus={!isMobile()} value={nome} onChange={atualizarNome} />

          <button type='submit' onClick={confirmarNome}>Salvar</button>

        </form>
    )
} 