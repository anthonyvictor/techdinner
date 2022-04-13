import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useApi } from "../../../../api";
import { FecharButton } from "../../../../components/FecharButton";
import { RodapeTechDinner } from "../../../../components/RodapeTechDinner";
import * as cores from '../../../../util/cores'
import { Pagamento } from "./pagamentoLi";

const UltimosPagamentos2 = ({clienteId, fechar}) => {
    const {api} = useApi()
    const [pagamentos, setPagamentos] = useState([]) 

      useEffect(() => {
       carregar()
      }, [clienteId])
      
      async function carregar(){
        const payload = {
            cliente: {id: clienteId}
        }
        const res = await api().get('clientes/pagamento/ultimos', {params: payload})

        if(res?.data?.length > 0){
            setPagamentos(res.data)
        }
      }

      function handleFechar(event){
        if(!event || (event && event.target === event.currentTarget)){
            fechar()
        }
      }

    return (
        <Container onClick={handleFechar}>
            {pagamentos.length > 0 
            ? (
                <main className='container'>
                    <h2>Últimos pagamentos:</h2>
                    <ul>
                        {pagamentos.map(pagamento => (
                            <Pagamento key={pagamento.id} pagamento={pagamento} readOnly={true} />
                        ))}
                    </ul>

                    <RodapeTechDinner />


                </main>
                )
            : (
                <main>Não Há pagamentos recentes!</main>
                )}
            <FecharButton fechar={handleFechar} />
        </Container>
    )
}

function ultimosPagamentosEqual(prevUltimosPagamentos, nextUltimosPagamentos){
    const res = prevUltimosPagamentos.clienteId === nextUltimosPagamentos.clienteId
    return res
}

export const UltimosPagamentos = React.memo(UltimosPagamentos2, ultimosPagamentosEqual)

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;

    z-index: 999;
    background-color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    > main{
        width: min(80vw, 400px);
        min-height: 100px;
        max-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: ${cores.branco};
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 2px 2px 10px rgba(0,0,0,.8);
        animation: aparecer .2s linear;
        gap: 5px;
        user-select: none;
        overflow: hidden;


        @keyframes aparecer{
            from{opacity: 0}
            to{opacity: 1}
        } 

        ul{
            height: min(80vh, 400px);
            width: 100%;
            overflow-y: scroll;

        }
    }

    > .close-container{
        height: 80vh;
        background-color: transparent;

        .close-button{
            padding: 10px;
            background-color: ${cores.branco};
            cursor: pointer;
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 50%;
        
        }
    }

`