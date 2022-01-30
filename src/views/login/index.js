import React from 'react';
import { Container } from './style';
import Logo from '../../images/logo-normal-black.svg'
// import { useAuth } from '../../auth';

function Login() {
    // const {user, setUser} = useAuth()
  return(
      <Container>
          <img src={Logo} alt='Logo-TechDinner'></img>
          <div className="container">
          <h1>Login</h1>
              <form>
                    <div className='form-input'>
                        <label for='user'>Usuário</label>
                        <input id='user' type='text' name='user' autoFocus/>
                    </div>
                    <div className='form-input'>
                        <label for='pass'>Senha</label>
                        <input id='pass' type='password' name='pass'/>
                    </div>
                    <div className='keep-connected-container'>
                        <input id='keep-connected' name='keep-connected' type="checkbox"/>
                        <label for='keep-connected'>Mantenha-me conectado</label>
                    </div>
                    <button type='button'>Entrar</button>
                </form>
                
          </div>
      </Container>
  )
}

export default Login;