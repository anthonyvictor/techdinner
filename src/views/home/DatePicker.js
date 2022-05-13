import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useMessage } from '../../components/Message'
import { cores } from '../../util/cores'
import { formatDateIso } from '../../util/Format'

export function DatePicker({ callback, close }) {
    const [date, setDate] = useState('')
    const [selectCheck, setSelectCheck] = useState(true)
    const [inputCheck, setInputCheck] = useState(false)
    const [selectValue, setSelectValue] = useState('')
    const [inputValue, setInputValue] = useState(getMinDate())
    const { message } = useMessage()

    useEffect(() => {
        if (selectCheck) {
            setDate(selectValue)
            setInputCheck(false)
        }
    }, [selectCheck])

    useEffect(() => {
        if (inputCheck) {
            setDate(inputValue)
            setSelectCheck(false)
        }
    }, [inputCheck])

    function getMinDate() {
        let minDate = formatDateIso(new Date()).substring(0, 16).replace(' ', 'T')
        let r = minDate
        return r
    }

    function avancar() {
        try {
            if (inputCheck && inputValue) {
                if (new Date() >= new Date(inputValue)) throw new Error()
                const r = inputValue.replace('T', ' ')
                callback(r)
            } else if (selectCheck && selectValue !== '') {
                const nextDate = new Date()
                nextDate.setMinutes(nextDate.getMinutes() + Number(selectValue))
                if (new Date() >= nextDate) throw new Error()
                const r = formatDateIso(nextDate).substring(0, 16).replace('T', ' ')
                callback(r)
            } else {
                throw new Error()
            }
        } catch {
            message('error', 'Período, ou data inválidos!')
        }
    }

    function fechar(e) {
        if (!e || e.target === e.currentTarget) {
            close()
        }
    }
    return (
        <DatePickerContainer onClick={fechar}>
            <div className='container'>
                <h4 className='title'>Selecione o tempo de arquivamento ou digite uma data específica:</h4>
                <section className='select'>
                    <input type={'radio'} checked={selectCheck} onChange={e => setSelectCheck(e.target.checked)} />
                    <select disabled={inputCheck} value={selectValue} onChange={e => setSelectValue(e.target.value)}>
                        <option value={''}>Selecione..</option>
                        <option value={5}>5min</option>
                        <option value={10}>10min</option>
                        <option value={20}>20min</option>
                        <option value={30}>30min</option>
                        <option value={60}>1h</option>
                        <option value={60 * 2}>2h</option>
                        <option value={60 * 5}>5h</option>
                        <option value={60 * 24}>1 dia</option>
                        <option value={60 * 48}>2 dias</option>
                        <option value={60 * 72}>3 dias</option>
                    </select>
                </section>
                <section className='date'>
                    <input type={'radio'} checked={inputCheck} onChange={e => setInputCheck(e.target.checked)} />
                    <input
                        type={'datetime-local'}
                        min={getMinDate()}
                        value={inputValue}
                        disabled={selectCheck}
                        onChange={e => setInputValue(e.target.value)}
                    />
                </section>
                <button onClick={avancar}>AVANÇAR</button>
            </div>
        </DatePickerContainer>
    )
}

const DatePickerContainer = styled.div`
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
        width: min(300px, 80%);
        /* height: 300px; */
        background-color: ${cores.branco};
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        gap: 10px;
        .title {
            text-align: center;
            flex-grow: 2;
        }

        section {
            display: flex;
            width: 100%;
            gap: 5px;

            input[type='radio'] {
                width: 20px;
                height: 20px;
            }

            input[type='datetime-local'],
            select {
                font-size: inherit;
                padding: 5px;
                flex-grow: 2;
                border-radius: 10px;
            }
        }
        button {
            flex-grow: 2;
            border: 1px solid black;
            border-radius: 10px;
            background-color: ${cores.verde};
            cursor: pointer;
            width: 100%;
            height: 50px;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    color: ${cores.amarelo};
                    font-weight: 600;
                }
            }
        }
    }
`
