import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useBoxEndereco } from '.'
import { enderecoToUrl } from '../../../../apis'
import { useHome } from '../../../../context/homeContext'

export const Mapa = () => {
    const {showMapa, setShowMapa} = useBoxEndereco()
    const [url, setUrl] = useState(null)
    const {curr} = useHome()

    useEffect(() => {
        getUrl()
    }, [])

    function getUrl() {
        enderecoToUrl(curr?.endereco)
            .then(e => setUrl(e))
            .catch(setUrl(null))
    }

    return (
        <Container>
            <button className='show-mapa' onClick={() => setShowMapa(prev => !prev)}>
                Exibir/Ocutar mapa
            </button>
            {showMapa && url && (
                <div className='mapouter'>
                    <div className='gmap_canvas'>
                        <iframe
                            title='mapa'
                            id='gmap_canvas'
                            src={`${url}&t=&z=16&ie=UTF8&iwloc=A&output=embed`}
                            frameBorder='0'
                            scrolling='no'
                            marginHeight='0'
                            marginWidth='0'
                            align='middle'
                        ></iframe>
                    </div>
                </div>
            )}
        </Container>
    )
}

const Container = styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:hover {
            color: blue;
        }
    }
    .mapouter {
        width: 100%;
        flex-grow: 2;
        height: 100%;

        overflow: hidden;
        border: 1px solid black;
        border-radius: 10px;
    }
    .gmap_canvas {
        overflow: hidden;
        background: none !important;
    }
    iframe {
        width: 100%;
        height: 250px;
        min-height: 50px;
    }
`
