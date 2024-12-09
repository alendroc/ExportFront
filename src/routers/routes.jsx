import { Routes, Route, Navigate } from "react-router-dom";
import { Configuracion } from "../pages/Configuracion";
import { Navegacion } from "../pages/Navegacion";
import {NavegacionP} from "../pages/Modulo Navegacion/navegacion1.jsx";
import { Umc } from "../pages/Modulo configuracion/umc.jsx";
import { Variedades } from "../pages/Modulo configuracion/variedades.jsx";
import { Articulos } from "../pages/Modulo configuracion/articulos.jsx";
import { IngresarDatos } from "../pages/Modulo Navegacion/ingresarDatos.jsx";
import { Productos } from "../pages/Modulo configuracion/productos.jsx";
import { Temporada } from "../pages/Modulo configuracion/temporada.jsx";
import { Usuarios } from "../pages/Modulo configuracion/adminUsuarios.jsx";
import { Lote } from "../pages/Modulo configuracion/lotes.jsx";
import { Departamento } from "../pages/Modulo configuracion/departamentos.jsx";
import { Labores } from "../pages/Modulo configuracion/labores.jsx"
import {Hibridos } from "../pages/Modulo configuracion/hibridos.jsx"



export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/Navegacion" element={<Navegacion/>}>
      <Route index element={<Navigate to="ver" replace />} />
        <Route path="ver" element={<NavegacionP/>} />
        <Route path="ingreso" element={<IngresarDatos/>}/>
      </Route>
      <Route path="/Configuracion"element={<Configuracion/>}>
        <Route index element={<Navigate to="articulos" replace />} />
        <Route path="variedades" element={<Variedades/>}/>
        <Route path="articulos" element={<Articulos/>}/>
        <Route path="productos" element={<Productos/>}/>
        <Route path="temporadas" element={<Temporada/>}/>
        <Route path="adminUsuarios" element={<Usuarios/>}/>
        <Route path="lotes" element={<Lote/>}/>
        <Route path="departamentos" element={<Departamento/>}/>
        <Route path="labores" element={<Labores/>}/>
        <Route path="hibridos" element={<Hibridos/>}/>
      </Route>
    </Routes>
  );
}
