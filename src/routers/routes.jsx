import { BrowserRouter,Routes, Route } from "react-router-dom";
import { Navegacion } from "../pages/Navegacion";
import { Configuracion } from "../pages/Configuracion";
import { Melones } from "../pages/Melones";
import { NavegacionP} from "../pages/Modulo Navegacion/navegacion1"
import { Inicio } from "../pages/Inicio.JSX";

export function MyRoutes(){
return(

    <Routes>
        <Route path="/"  element={<Inicio />}/>
        <Route path="/Navegacion" element={<Navegacion />}/>
        <Route path="/Navegacion1/sub1" element={<NavegacionP />}/>
        <Route path="/Configuracion" element={<Configuracion />}/>
        <Route path="/Melones" element={<Melones />}/>
    </Routes> 
    );
}