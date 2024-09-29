import styled from "styled-components";
import React from 'react';
import { useNavigate } from "react-router-dom";
export function Login({ sesion }) {
  const navigate = useNavigate();

  const iniciarSesion = (e) => {
    e.preventDefault();
    sesion(true);
    navigate("/inicio"); // Redirige al usuario a /inicio
  };

  return (
    <div className="bg-slate-500 w-full h-screen flex justify-center items-center">
      <div className="bg-zinc-50 grid grid-cols-[60%_auto] w-[700px] h-[60%] rounded-2xl overflow-hidden shadow-lg">
        <form className="bg-slate-100 pl-28 pt-20 font-poppi flex flex-col">
            <h1 className=" text-[32px] mb-8">Iniciar sesión</h1>
            <div className="flex flex-col mb-6">
              <label className="mb-3 text-sm">Nombre de usuario</label>
              <input className="w-full max-w-[220px] h-[30px] p-3 rounded-[7px] border-[1.5px] border-lightgrey 
         outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] 
         shadow-[0_0_20px_-18px_rgba(0,0,0,0.1)] font-light text-xxxs
         hover:shadow-[0_0_20px_-17px_rgba(0,0,0,0.1)] hover:border-[2px]
         active:scale-95 focus:border-2 focus:border-grey"></input>
            </div>
            <div className="flex flex-col">
              <label className="mb-3 text-sm">Contraseña</label>
              <input placeholder="Coloque su contraseña" className="w-full max-w-[220px] h-[30px] p-3 rounded-[7px] border-[1.5px] border-lightgrey 
         outline-none transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] 
         shadow-[0_0_20px_-18px_rgba(0,0,0,0.1)] font-light text-xs mb-9
         hover:shadow-[0_0_20px_-17px_rgba(0,0,0,0.1)] hover:border-[2px]
         active:scale-95 focus:border-2 focus:border-grey" type="password"></input>
            </div>
            <button className="cursor-pointer transition-all bg-green-500 text-white px-6 py-2 rounded-lg
          border-green-600 w-full max-w-[220px] text-sm
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
            Inciar sesion
            </button>
        </form>
        <div className="bg-[linear-gradient(45deg,rgb(8,38,17)_0%,rgb(8,38,17)_14.286%,rgb(13,64,27)_14.286%,rgb(13,64,27)_28.572%,rgb(17,91,36)_28.572%,rgb(17,91,36)_42.858%,rgb(22,117,46)_42.858%,rgb(22,117,46)_57.144%,rgb(26,143,56)_57.144%,rgb(26,143,56)_71.43%,rgb(31,170,65)_71.43%,rgb(31,170,65)_85.716%,rgb(35,196,75)_85.716%,rgb(35,196,75)_100.002%)]
        w-full">
            
        </div>
   
      </div>
      
    </div>
  );
}
