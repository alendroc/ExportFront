import { BrowserRouter,Routes, Route } from "react-router-dom";
import { Navegacion } from "../pages/Navegacion";
import { Configuracion } from "../pages/Configuracion";
import { Melones } from "../pages/Melones";
import { Inicio } from "../pages/Inicio.JSX";

export function MyRoutes(){
return(

    <Routes>
        <Route path="/"  element={<Inicio />}/>
        <Route path="/Navegacion" element={<Navegacion />}/>
        <Route path="/Configuracion" element={<Configuracion />}/>
        <Route path="/Melones" element={<Melones />}/>
    </Routes> 
    );
}