
import React, { useState, useEffect } from 'react';
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
    <div className="bg-[#CFE3F8] w-full h-screen font-poppi flex justify-center items-center relative">
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
               placeholder="increse su nombre de usuario" 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                class="w-full max-w-[300px] h-[30px]  p-3 rounded-[12px] text-xs border-[1.5px] border-lightgrey outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-[0px_0px_20px_-18px] hover:border-2 hover:border-lightgrey hover:shadow-[0px_0px_20px_-17px] active:scale-[0.95] focus:border-2 focus:border-grey"
/>
            </div>

            <div className="flex flex-col mb-6">
              <label className="mb-3 text-sm">Contraseña</label>
              <input
              placeholder="increse su contraseña" 
                class="w-full max-w-[300px] h-[30px]  p-3 rounded-[12px] text-xs border-[1.5px] border-lightgrey outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-[0px_0px_20px_-18px] hover:border-2 hover:border-lightgrey hover:shadow-[0px_0px_20px_-17px] active:scale-[0.95] focus:border-2 focus:border-grey"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

          
            <button
             type="submit" 
            class="cursor-pointer transition-all bg-green-500 text-white px-6 py-2 rounded-lg
            border-green-600
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
            Iniciar sesión
            </button>
          </form>

          <div
            className="bg-[linear-gradient(45deg,rgb(8,38,17)_0%,rgb(8,38,17)_14.286%,rgb(13,64,27)_14.286%,rgb(13,64,27)_28.572%,rgb(17,91,36)_28.572%,rgb(17,91,36)_42.858%,rgb(22,117,46)_42.858%,rgb(22,117,46)_57.144%,rgb(26,143,56)_57.144%,rgb(26,143,56)_71.43%,rgb(31,170,65)_71.43%,rgb(31,170,65)_85.716%,rgb(35,196,75)_85.716%,rgb(35,196,75)_100.002%)] w-full"
          ></div>

        </div>
      </div>
    </div>
  );
}


export default Login;


