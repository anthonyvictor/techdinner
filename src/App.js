import React, { useState } from 'react';
import './App.css';
import GlobalStyle from './globals'
import Base from './Base'
import Login from './views/login' 
import { useAuth } from './auth'

function App() {

  const {user} = useAuth()

  if(user === null){
    return(
      <Login />
    )
  }else{
    return (
      <Base>
      <GlobalStyle />
      </Base>
     )
  }
 
}

export default App;
