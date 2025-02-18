import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../routers/ProtectedRoute";
import { Configuracion } from "../pages/Configuracion";
import { ProgramaO } from "../pages/ProgramaO.jsx";
import { Navegacion } from "../pages/Navegacion";
import {NavegacionP} from "../pages/Modulo Navegacion/navegacion1.jsx";
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
import { AsignarLote } from "../pages/Modulo Programa O/asignarLote.jsx";
import { AsignarLabor } from "../pages/Modulo Programa O/asignarLabor.jsx";
import { Certificaciones } from "../pages/Modulo configuracion/certificaciones.jsx";


export const MyRoutes = ({isAuthenticated, usuario}) => {
  return (
    <Routes>
      <Route path="/Navegacion" element={<Navegacion/>}>
      <Route index element={<Navigate to="ver" replace />} />
        <Route path="ver" element={<NavegacionP/>} />
        <Route path="ingreso" element={<IngresarDatos/>}/>
      </Route>
      <Route path="/Configuracion" element={
        <ProtectedRoute
        isAuthenticated={isAuthenticated}
        userRole={usuario.rolDeUsuario}
        allowedRoles={["ADMIN"]}
      ><Configuracion/></ProtectedRoute>}>
        <Route index element={<Navigate to="articulos" replace />} />
        <Route path="variedades" element={<Variedades/>}/>
        <Route path="articulos" element={<Articulos/>}/>
        <Route path="certificaciones" element={<Certificaciones/>}/>
        <Route path="productos" element={<Productos/>}/>
        <Route path="temporadas" element={<Temporada/>}/>
        <Route path="adminUsuarios" element={<Usuarios/>}/>
        <Route path="lotes" element={<Lote/>}/>
        <Route path="departamentos" element={<Departamento/>}/>
        <Route path="labores" element={<Labores/>}/>
        <Route path="hibridos" element={<Hibridos/>}/>
      </Route>
      <Route path="/ProgramaO" element={ 
        <ProtectedRoute
        isAuthenticated={isAuthenticated}
        userRole={usuario.rolDeUsuario}
        allowedRoles={["ADMIN"]}
      ><ProgramaO/></ProtectedRoute>}>
        <Route index element={<Navigate to="asignar-Lotes" replace />} />
        <Route path="asignar-Lotes" element={<AsignarLote/>}/>
        <Route path="asignar-Labores" element={<AsignarLabor/>} />
      </Route>

    </Routes>
  );
}
