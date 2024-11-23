// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('login_success'));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const login = async (email, password) => {
    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!validUser) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email o contraseña incorrectos'
      });
      return false;
    }

    // Guardar sesión
    localStorage.setItem('login_success', JSON.stringify(validUser));
    setUser(validUser);

    await Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Has iniciado sesión correctamente`
    });

    navigate('/');
    return true;
  };

  const logout = async () => {
    const result = await Swal.fire({
      icon: 'info',
      title: 'Cerrar Sesión',
      text: '¿Estás seguro de que quieres cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Si, Cerrar Sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('login_success');
      setUser(null);
      
      await Swal.fire({
        icon: 'success',
        title: 'Sesión Cerrada',
        text: 'Has cerrado sesión correctamente',
        confirmButtonText: 'Ok'
      });
      
      navigate('/');
    }
  };

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el email ya está registrado
    if (users.some(user => user.email === userData.email)) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Este correo electrónico ya está registrado'
      });
      return false;
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now(),
      ...userData
    };

    // Guardar en localStorage
    localStorage.setItem('users', JSON.stringify([...users, newUser]));

    await Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu cuenta ha sido creada correctamente'
    });

    navigate('/login');
    return true;
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};