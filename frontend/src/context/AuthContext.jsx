import React, { createContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axiosConfig.jsx'
import { useNavigate } from 'react-router-dom';
import { setLogoutHandler } from '../services/authService'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(undefined)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const refreshResponse = await api.post('/usuarios/refresh');
        if (refreshResponse.data.accessToken) {
          api.defaults.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
        }

        const response = await api.get('/usuarios/me');
        setUsuario(response.data);
      } catch (error) {
        setUsuario(null);
      }
    };

    fetchUsuario();
  }, [])

  const login = async (email, password) => {
    try {
      const responseLogin = await api.post('/usuarios/login', { email, password });
      const token = responseLogin.data;

      const refreshResponse = await api.post('/usuarios/refresh');
      if (refreshResponse.data.accessToken) {
        api.defaults.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
      }

      const response = await api.get('/usuarios/me');
      setUsuario(response.data)
    } catch (err) {
      throw err.response?.data?.error || "Error al iniciar sesión";
    }
  }

  const logout = useCallback(async () => {
    await api.post('/usuarios/logout');
    setUsuario(null);
    delete api.defaults.headers.common['Authorization'];
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/');
  }, [setUsuario, navigate]);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  const register = async (email, password, confPassword, nombre) => {
    try {
      await api.post('/usuarios/registrar',
        { email, nombre, password, confPassword })
    } catch (err) {
      throw err.response?.data?.error || "Error al registrar usuario";
    }
  }

  const updateUser = async (formData) => {
    try {
      const response = await api.put('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUsuario(response.data); // Actualizamos el usuario con los nuevos datos
    } catch (err) {
      throw err.response?.data?.error || "Error actualizando el perfil";
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete('/usuarios');
      logout();
    } catch (err) {
      throw err.response?.data?.error || "Error al eliminar el usuario";
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, register, updateUser, deleteUser, api }}>
      {children}
    </AuthContext.Provider>
  )
}