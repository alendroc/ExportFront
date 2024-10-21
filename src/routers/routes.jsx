import { Routes, Route, Navigate } from "react-router-dom";
import { Configuracion } from "../pages/Configuracion";
import { Navegacion } from "../pages/Navegacion";
import {NavegacionP} from "../pages/Modulo Navegacion/navegacion1.jsx";
import { Umc } from "../pages/Modulo configuracion/umc.jsx";
import { Variedades } from "../pages/Modulo configuracion/variedades.jsx";
import { Articulos } from "../pages/Modulo configuracion/articulos.jsx";
import { IngresarDatos } from "../pages/Modulo Navegacion/ingresarDatos.jsx";



export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/Navegacion" element={<Navegacion/>}>
      <Route index element={<Navigate to="ver" replace />} />
        <Route path="ver" element={<NavegacionP/>} />
        <Route path="ingreso" element={<IngresarDatos/>}/>
      </Route>
      <Route path="/Configuracion"element={<Configuracion/>}>
        <Route index element={<Navigate to="umc" replace />} />
        <Route path="umc" element={<Umc/>}/>
        <Route path="variedades" element={<Variedades/>}/>
        <Route path="articulos" element={<Articulos/>}/>
      </Route>
    </Routes>
  );
}
