import React, { createContext, useEffect, useState } from 'react'
import api from '../api/axiosConfig.jsx'
export const AuthContext=createContext();

export const AuthProvider= ({children}) => {
  const [usuario,setUsuario]=useState(null)

  useEffect(()=>{
    api.get('/usuarios/me')
    .then(res=>setUsuario(res.data))
    .catch(()=>setUsuario(null))
  },[])

  const login = async (email,password)=>{
    await api.post('/usuarios/login',
      {email,password})
    setUsuario({email})
  }
  
  const logout = async ()=>{
    await api.post('/usuarios/logout')
    setUsuario(null)
  }

  const register = async (email,password,confPassword,nombre)=>{
    await api.post('/usuarios/registrar',
      {email,nombre,password,confPassword})
  }
  return (
    <AuthContext.Provider value={{usuario,login,logout,register,api}}>
      {children}
    </AuthContext.Provider>
  )
}