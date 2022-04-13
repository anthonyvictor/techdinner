import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as cores from '../../../../util/cores'
import { usePagamentos } from './pagamentos'
import { useAsk } from '../../../../components/Ask'
import { useMessage } from '../../../../components/Message'
import { useValuer } from '../../../../components/Valuer'
import { getValorPendente } from '../../../../util/pedidoUtil'

const Button = ({texto, cor, icone, disabled}) => {
    const {addPagamento, pagamentosCount, valorInputRef, inputValue, fakePedido, pagamento} = usePagamentos()
    const {ask} = useAsk()
    const {message} = useMessage()
    const {valuer} = useValuer()

    async function especie(){
        const resposta = await valuer(valorInputRef.current.value) 
        return resposta
    }

    async function formaClick(event){
        event && event.preventDefault()

        const tipo = 
        texto === 'Especie' ? 0 :
        texto === 'Cartão' ? 1 :
        texto === 'PIX' ? 2 :
        texto === 'Transf.' ? 3 :
        texto === 'Agend.' ? 4 :
        texto === 'N/Info.' ? 5 :
        null

        if(isNaN(tipo)) {
            message('error', 'Tipo de pagamento não reconhecido.')
            return
        }

        const valorRecebido = 
        tipo === 0 ? await especie() : valorInputRef.current.value

        if(isNaN(valorRecebido)) {
            message('error', 'Valor recebido não reconhecido.')
            return
        }

        if(tipo === 5){
            next(0)
        }else{
            ask({
                title: 'Este pagamento já foi efetuado?',
                buttons: [
                    {title: 'SIM', click:() => next(1)},
                    {title: 'NÃO', click:() => next(0)}
                ],
                allowCancel: true
                })
        }

            function next(status){
                const newValor = Number(valorInputRef.current.value)
                const newPagamento = {
                    id: (
                        newValor === pagamento?.valorPago 
                        ? pagamento.id
                        : `fake${pagamentosCount + 1}`
                    ),
                    tipo: tipo,
                    dataAdicionado: new Date(),
                    dataRecebido: (status === 1 ? new Date() : null),
                    status: status,
                    valorPago: newValor,
                    valorRecebido: Number(valorRecebido)
                }
                addPagamento(newPagamento)
            }     
    }
    return (
        <ButtonContainer 
        style={{ color: cor, borderColor: cor }}
        onClick={formaClick}
        disabled={disabled || inputValue <= 0 || inputValue > getValorPendente(fakePedido)}
        >
            <FontAwesomeIcon icon={icone} />
            <label>{texto}</label>
        </ButtonContainer>
    )
}

export const Formas = props => {

    return (
        <Container>
            <Button texto={'Especie'} cor={cores.verde} icone={icons.faMoneyBillWaveAlt} />
            <Button texto={'Cartão'} cor={cores.azul} icone={icons.faCreditCard} />
            <Button texto={'PIX'} cor={cores.roxoDark} icone={icons.faGlobe} />
            <Button texto={'Transf.'} cor={cores.laranjaDark} icone={icons.faExchangeAlt} disabled />
            <Button texto={'Agend.'} cor={cores.roxo} icone={icons.faCalendarCheck} disabled />
            <Button texto={'N/Info.'} cor={cores.vermelho} icone={icons.faQuestion} />
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    @media (max-width: 760px) {
        height: 100px;
    }
`

const ButtonContainer = styled.button`
    background-color: whitesmoke;
    border-radius: 25px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    flex-grow: 1;
    width: 15%;
    border: 3px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
    font-size: 16px;
    transition: font-size 0.1s linear;
    * {
        pointer-events: none;
    }
    svg {
        font-size: 25px;
    }
    &:not(:disabled){
        cursor: pointer;
        &:hover {
            font-size: 18px;
            font-weight: 600;
        }
    }
    &:disabled{
        *{color: gray;}
    }

    @media (max-width: 760px) {
            width: 30%;
    }
` 
