import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useNavigate } from "react-router-dom";
import { UsuarioService } from "../services/UsuarioService";
import { Usuario } from "../models/Usuario";

var usuarioService = new UsuarioService();

export function Login({ sesion }) {
  
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const iniciarSesion = (e) => {
    
    e.preventDefault();

    usuarioService.login(new Usuario(user, "", pass, null, ""))
      .then(response => {
        if (response.success) {
          console.log('Login exitoso:', response.user);
          sesion(true);
          navigate("/inicio");
        } else {
          console.log('Login fallido, status:', response.status);
        }
      })
      .catch(error => {
        console.error('Error durante el login:', error);
      })
      .finally(() => {
        console.log('Operación de login finalizada');
      });
  };

  return (
    <div className="bg-slate-500 w-full h-screen flex justify-center items-center relative">
      <div className="absolute inset-0">
        <div className="w-full h-full scale-100 overflow-hidden">
          <Spline scene="https://prod.spline.design/fGXpAFcvPDB6bUrd/scene.splinecode" />
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex justify-center items-center">
        <div className="bg-zinc-50 grid grid-cols-[60%_auto] w-[700px] h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <form className="bg-slate-100 px-[20%] py-[10%] flex flex-col" onSubmit={iniciarSesion}>
            <h1 className="text-[32px] mb-8">Iniciar sesión</h1>

            <div className="flex flex-col mb-6">
              <label className="mb-3 text-sm">Nombre de usuario</label>
              <input
                className="input-style"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-6">
              <label className="mb-3 text-sm">Contraseña</label>
              <input
                className="input-style"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <button
              className="cursor-pointer bg-green-500 text-white px-6 py-2 rounded-lg w-full"
              type="submit"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
