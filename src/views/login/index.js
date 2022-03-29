import React, {useEffect, useState } from 'react';
import { Container } from './style';
import Logo from '../../images/logo-normal-black.svg'
import { isMobile, isNEU } from '../../util/misc';
import { useApi } from '../../api';
import { getStored, setStored } from '../../util/local';


function Login() {
    const {refresh} = useApi()

    const [newUser, setNewUser] = useState(getStored('user'))
    const [newPassword, setNewPassword] = useState(getStored('password'))
    const [errorUser, setErrorUser] = useState(<></>)
    const [errorPassword, setErrorPassword] = useState(<></>)
    const erro = <p className='error' style={{color: '#ff3729'}}>Este campo é obrigatório!</p>

    function mudarUser(e){
        e.preventDefault()
        if(isNEU(newUser)){
            setErrorUser(erro)
        }else if(isNEU(newPassword)){
            setErrorPassword(erro)
        }else{
            setStored('user', newUser)
            setStored('password', newPassword)
            refresh(newUser, newPassword)
        }
    }

    useEffect(() => {
        if(!isNEU(newUser)) setErrorUser(<></>)
    }, [newUser])

    useEffect(() => {
        if(!isNEU(newPassword)) setErrorPassword(<></>)
    }, [newPassword])

  return(
      <Container>
          <img src={Logo} alt='Logo-TechDinner'></img>
          <div className="container">
          <h1>Login</h1>
              <form>
                    <section className='form-input'>
                        <label htmlFor='user'>Usuário</label>
                        <input id='user' type='text' name='user' autoFocus={!isMobile()} required={true}
                        value={newUser} onChange={e => setNewUser(e.target.value)} />
                        {errorUser}
                    </section>
                    <section className='form-input'>
                        <label htmlFor='pass'>Senha</label>
                        <input id='pass' type='password' name='pass' required={true}
                        value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        {errorPassword}
                    </section>
                    <div className='keep-connected-container'>
                        <input id='keep-connected' name='keep-connected' type="checkbox"/>
                        <label htmlFor='keep-connected'>Mantenha-me conectado</label>
                    </div>
                    <button type='submit' onClick={mudarUser}>Entrar</button>
                </form>

          </div>
      </Container>
  )
}

export default Login;