import { Routes, Route, Navigate } from "react-router-dom";
import { Configuracion } from "../pages/Configuracion";

import { Navegacion } from "../pages/Navegacion";
import { Inicio } from "../pages/Inicio.JSX";
import {NavegacionP} from "../pages/Modulo Navegacion/navegacion1.jsx"


export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/inicio"  element={<Inicio/>}  />
      <Route path="/Navegacion" element={<Navegacion/>}/>
      <Route path="/Navegacion1/sub1" element={<NavegacionP/>} />
      <Route path="/Configuracion"element={<Configuracion/>}/>
    </Routes>
  );
}
