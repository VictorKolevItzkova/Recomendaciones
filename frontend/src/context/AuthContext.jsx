import React, { createContext, useEffect, useState } from 'react'
import api from '../api/axiosConfig.jsx'
import { useNavigate } from 'react-router-dom';
export const AuthContext=createContext();

export const AuthProvider= ({children}) => {
  const [usuario,setUsuario]=useState(null)
  const navigate=useNavigate()
  useEffect(()=>{
    const fetchUsuario = async () => {
      try {
        const response = await api.get('/usuarios/me');
        setUsuario(response.data);
      } catch (error) {
        setUsuario(null);
      }
    };
  
    fetchUsuario();
  },[])

  const login = async (email,password)=>{
    try{
      await api.post('/usuarios/login',
        {email,password})
      const response = await api.get('/usuarios/me');
      setUsuario(response.data)
    }catch(err){
      throw err.response?.data?.error || "Error al iniciar sesión";
    }
  }
  
  const logout = async ()=>{
    await api.post('/usuarios/logout')
    setUsuario(null)
    navigate('/')
  }

  const register = async (email,password,confPassword,nombre)=>{
    try{
      await api.post('/usuarios/registrar',
        {email,nombre,password,confPassword})
    }catch(err){
      throw err.response?.data?.error || "Error al registrar usuario";
    }
  }

  const updateUser = async (formData) => {
    try {
      const response = await api.put('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUsuario(response.data); // Actualizamos el usuario con los nuevos datos
    } catch (error) {
      console.error("Error actualizando el perfil:", error);
    }
  };

  return (
    <AuthContext.Provider value={{usuario,login,logout,register,updateUser,api}}>
      {children}
    </AuthContext.Provider>
  )
}