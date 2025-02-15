import { MyRoutes } from "./routers/routes"; // Asegúrate de que sea un componente React
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import React, { useState, useEffect } from "react";
import { NavbarP } from "./components/navbarP";
import { AiOutlineHome, AiOutlineGlobal } from "react-icons/ai";
import { GiWatermelon, GiSugarCane, GiPlantsAndAnimals, GiFactory } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { FaDroplet, FaStore, FaCloudRain, FaHandHoldingDroplet,FaGears } from "react-icons/fa6";
import {Login } from "../src/pages/Login.jsx";

function App() {
  const [isActive, setIsActive] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(()=>{return sessionStorage.getItem('sesion') === 'activa' ? true : false;});
  const [theme, setTheme] = useState(()=>{if(window.matchMedia('dark').matches){return "dark"} return "ligth"});
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector('html').classList.add("dark");
    } else {
      document.querySelector('html').classList.remove("dark");
    }
    console.log(theme)
  }, [theme]);

  const autenticacion = () =>{sessionStorage.getItem('sesion') === 'activa' ? setIsAuthenticated(true) : setIsAuthenticated(false);}
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const linksArray = [
    {
      label: "Navegacion",
      icon: <AiOutlineGlobal />,
      to: "/Navegacion",
      submenu: [
        { name: "Ver navegador", href: "/Navegacion/ver" },
        { name: "Ingresar datos", href: "/Navegacion/ingreso" }
      ]
    },
    {
      label: "Configuracion",
      icon: <IoMdSettings  />,
      to: "/Configuracion",
      submenu: [
        //{ name: "UMC", href: "/Configuracion/umc" },//unidad de medidas y certificacion
        { name: "Articulos", href: "/Configuracion/articulos"},
        { name: "Temporada", href: "/Configuracion/temporadas"},
        { name: "Lotes", href: "/Configuracion/lotes"},
        { name: "Variedades", href: "/Configuracion/variedades"},
        { name: "Hibridos", href: "/Configuracion/Hibridos"},
        { name: "Departamentos", href: "/Configuracion/Departamentos"},
        { name: "Labores", href: "/Configuracion/labores"},
        { name: "Productos", href: "/Configuracion/productos"},
        { name: "Administracion de usuarios", href: "/Configuracion/AdminUsuarios" ,width: "60px"},
      ]
    },
    {
      label: "Programa Operativo",
      icon: <FaGears  />,
      to: "/ProgramaO",
      submenu: [
        { name: "Asignar Lotes", href: "/ProgramaO/asignar-Lotes", width: "60px" },
        { name: "Asignar Híbridos", href: "/ProgramaO/asignar-Hibridos",width: "70px" },
        { name: "Asignar Labores", href: "/ProgramaO/asignar-labores",width: "60px"},
        { name: "Asignar DDT por Labor", href: "/ProgramaO/asignar-ddt",width: "100px" },
        { name: "Diseñar Prog. Operativo", href: "/ProgramaO/disenar-programa", width: "110px"},
        { name: "Actualizar versión P.O", href: "/ProgramaO/actualizar-po",width: "90px" },
        { name: "Camas", href: "/ProgramaO/camas" },
        { name: "Actualizar Lotes P.O", href: "/ProgramaO/actualizar-lotes", width: "70px"},
        { name: "Actualizar Programa Operativo", href: "/ProgramaO/actualizar-programa", width: "150px"},
      ]
    },
  ];
  const arrayModules = [
    
    {
      label: "Caña",
      icon: <GiSugarCane />,
      to: "/Cana",
      submenu: [
        { name: "Lotes de Caña", href: "/cana/lotes" },
        { name: "Asignar Labores y DDC/S", href: "/cana/asignar-labores" },
        { name: "Asignar Productos", href: "/cana/asignar-productos" },
        { name: "Corta de Caña", href: "/cana/corta" },
        { name: "Registrar boletas", href: "/cana/registrar-boletas" },
        { name: "Ajustar miel azúcar", href: "/cana/ajustar-miel" },
        { name: "Ver registro de boletas", href: "/cana/ver-boletas" },
        { name: "Ver cosecha por zafra", href: "/cana/ver-zafra" },
        { name: "Ver cosecha por lote", href: "/cana/ver-lote" },
      ]
    },
    {
      label: "Riego",
      icon: <FaDroplet />,
      to: "/Riego",
      submenu: [
        { name: "Asignar productos", href: "/riego/asignar-productos" },
        { name: "Hacer pedidos", href: "/riego/hacer-pedidos" },
        { name: "Modificar o añadir otros pedidos", href: "/riego/modificar-pedidos" },
        { name: "Registro de boletas más productos", href: "/riego/registro-boletas-productos" },
        { name: "Registro de boletas solo agua", href: "/riego/registro-boletas-agua" },
      ]
    },
    {
      label: "Fitoprotección",
      icon: <GiPlantsAndAnimals />,
      to: "/Fitoproteccion",
      submenu: [
        { name: "Asignar", href: "/fitoproteccion/asignar" },
        { name: "Monitoreo", href: "/fitoproteccion/monitoreo" },
        { name: "Registro", href: "/fitoproteccion/registro" },
        { name: "Motivo", href: "/fitoproteccion/motivo" },
        { name: "Código", href: "/fitoproteccion/codigo" },
      ]
    },
    {
      label: "Bodega",
      icon: <FaStore />,
      to: "/Bodega",
      submenu: [
        { name: "Ver pedidos", href: "/bodega/ver-pedidos" },
        { name: "Buscar boletas", href: "/bodega/buscar-boletas" },
        { name: "Motivo de aplicación", href: "/bodega/motivo-aplicacion" },
        { name: "Código trazabilidad", href: "/bodega/codigo-trazabilidad" },
      ]
    },
    {
      label: "Meteorología",
      icon: <FaCloudRain />,
      to: "/Meteorologia",
      submenu: [
        { name: "Registro de pluviometros", href: "/meteorologia/registro-pluviometros" },
        { name: "Registro de Lluvias", href: "/meteorologia/registro-lluvias" },
        { name: "Consulta de lluvias", href: "/meteorologia/consulta-lluvias" },
      ]
    },
    {
      label: "Labores Culturales",
      icon: <FaHandHoldingDroplet />,
      to: "/LaboresCulturales",
      submenu: [
        { name: "Boletas y Programas de riego", href: "/labores/boletas-programas" },
        { name: "Programa por lote", href: "/labores/programa-lote" },
        { name: "Buscar boletas", href: "/labores/buscar-boletas" },
      ]
    },
    {
      label: "Planta",
      icon: <GiFactory />,
      to: "/Planta",
      submenu: [
        { name: "Labores", href: "/planta/labores" },
        { name: "Consultas de riego", href: "/planta/consultas-riego" },
        { name: "Datos", href: "/planta/datos" },
        { name: "Programas", href: "/planta/programas" },
        { name: "Productos aplicados", href: "/planta/productos-aplicados" },
      ]
    }
  ];
  const linksArrayExtras = [
    {
      label: "Consultas",
      icon: <AiOutlineHome />,
      to: "/Consultas",
      submenu: [
        { name: "Navegacion1", href: "/Navegacion1/sub1" },
        { name: "Navegacion2", href: "/Navegacion1/sub2" },
        { name: "Navegacion3", href: "/Navegacion1/sub3" },
        { name: "Navegacion4", href: "/Navegacion1/sub4" },
      ]
    },
    {
      label: "Reportes",
      icon: <AiOutlineHome />,
      to: "/Reportes",
      submenu: [
        { name: "Configuracion1", href: "/config/sub1" },
        { name: "Configuracion2", href: "/config/sub2" }
      ]
    },
  ];

  const arreglos = linksArray.concat(arrayModules);

function navbar(location,arreglos){

  for (const link of arreglos)
  if(link.to === location.pathname || link.submenu.find(sub => sub.href === location.pathname)){
    return link.submenu || [];
  }
    //console.log("aa" + location.pathname);
  return [];
}
 const activeSubmenu = navbar(location,arreglos);

 if(!isAuthenticated || location.pathname === "/"){
  return(<Login sesion={autenticacion}/>)}
 else{
  return (
    <>
      <div className={`grid ${isActive ? 'grid-cols-[13rem_auto]' : 'grid-cols-[90px_auto]'} bg-slate-100 dark:bg-slate-900 transition-all duration-300`}>
        <Sidebar 
        theme={theme} 
        setTheme={setTheme}
        sidebarOpen={isActive}
        usuario={usuario}
        setSidebarOpen={setIsActive}
        arreglo = {linksArray}
        arreglo2 = {arrayModules}
        arreglo3 = {linksArrayExtras}
        />
      <div className="flex flex-col w-full">
        {activeSubmenu.length > 0 && location.pathname !== '/' && (
          <div className="sticky top-0 z-10">
            <NavbarP menu={activeSubmenu} />
          </div>
        )}
         <div>
            <MyRoutes  
            isAuthenticated={isAuthenticated} 
            usuario={usuario}/>
        </div>
      </div>
    </div>

    </>
  );
}
}
export default function WrappedApp(){
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

