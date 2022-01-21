import React from 'react';
import GlobalStyle from './globals'
import Base from './Base'
import Login from './views/login' 
import { useAuth } from './auth'

function App() {

  const {user} = useAuth()

  return(
    user 
      ? (
        <Base>
        <GlobalStyle />
        </Base>
      ):(
        <Login />
      )
    
  )
  
  // <Global />

  // if(user === null){
  //   return(
  //     <Login />
  //   )
  // }else{
  //   return (
      
  //    )
  // }
 
}

export default App;
