import { MyRoutes } from "./routers/routes"; // Asegúrate de que sea un componente React
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import React, { useState, useEffect } from "react";
import { NavbarP } from "./components/navbarP";
import { AiFillMeh,AiOutlineLeft, AiOutlineHome, AiOutlineApartment} from "react-icons/ai";
import { GiWatermelon, GiSugarCane, GiPlantsAndAnimals, GiFactory } from "react-icons/gi";
import { FaDroplet, FaStore, FaCloudRain, FaHandHoldingDroplet} from "react-icons/fa6";
import styled from "styled-components"; // Si usas styled-components

function App() {
  const [theme, setTheme] = useState(()=>{
    if(window.matchMedia('(prefers-color-scheme: dark)').matches)
    {return "dark"}
    return "light"
  });
  const [isActive, setIsActive] = useState(true);
  /*
  const [activeSubmenu, setActiveSubmenu] = useState(() => {
    // Recupera el submenú activo del almacenamiento local
    const savedSubmenu = localStorage.getItem('activeSubmenu');
    return savedSubmenu ? JSON.parse(savedSubmenu) : [];
  });*/

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector('html').classList.add("dark");
    } else {
      document.querySelector('html').classList.remove("dark");
    }
    console.log(theme)
  }, [theme]);

  const linksArray = [
    {
      label: "Navegacion",
      icon: <AiOutlineHome />,
      to: "/Navegacion",
      submenu: [
        { name: "Navegacion1", href: "/config/sub1" },
        { name: "Navegacion2", href: "/config/sub2" },
        { name: "Navegacion3", href: "/config/sub1" },
        { name: "Navegacion4", href: "/config/sub1" },
      ]
    },
    {
      label: "Configuracion",
      icon: <AiOutlineHome />,
      to: "/Configuracion",
      submenu: [
        { name: "Configuracion1", href: "/config/sub1" },
        { name: "Configuracion2", href: "/config/sub2" }
      ]
    },
  ];
  const arrayModules = [
    {
      label: "Melones",
      icon: <GiWatermelon/>,
      to: "/Melones",
      submenu: [
        { name: "Asignar Lotes", href: "/config/sub1" },
        { name: "Asignar Híbridos", href: "/config/sub2" },
        { name: "Asignar Labores", href: "/config/sub1" },
        { name: "Asignar DDT por Labor", href: "/config/sub1" },
        { name: "Diseñar Prog.Operativo", href: "/config/sub1" },
        { name: "Actualizar versión P.O", href: "/config/sub1" },
        { name: "Camas", href: "/config/sub1" },
        { name: "Actualizar Lotes P.O", href: "/config/sub1" },
        { name: "Actualizar Programa Opera", href: "/config/sub1" },
      ]
    },
    {
      label: "Caña",
      icon: <GiSugarCane/>,
      to: "/Caña",
      submenu: [
        { name: "Lotes de Caña", href: "/config/sub1" },
        { name: "Asignar Labores y DDC/S", href: "/config/sub2" },
        { name: "Asignar Productos", href: "/config/sub2" },
        { name: "Corta de Caña", href: "/config/sub2" },
        { name: "Registrar boletas", href: "/config/sub2" },
        { name: "Ajustar miel azúcar", href: "/config/sub2" },
        { name: "Ver registro de boletas", href: "/config/sub2" },
        { name: "Ver cosecha por zafra", href: "/config/sub2" },
        { name: "Ver cosecha por lote", href: "/config/sub2" },
      ]
    },
    {
      label: "Riego",
      icon: <FaDroplet />,
      to: "/Riego",
      submenu: [
        { name: "Asignar productos", href: "/config/sub1" },
        { name: "Hacer pedidos", href: "/config/sub2" },
        { name: "Modificar o añadir otros pedidos", href: "/config/sub2" },
        { name: "Registro de boletas más productos", href: "/config/sub2" },
        { name: "Registro de boletas solo agua", href: "/config/sub2" },
      ]
    },
    {
      label: "Fitoproteccion",
      icon: <GiPlantsAndAnimals/>,
      to: "/Fitoproteccion",
      submenu: [
        { name: "Asignar productos", href: "/config/sub1" },
        { name: "Monitoreo de plagas", href: "/config/sub2" },
        { name: "Monitoreo de frutas", href: "/config/sub2" },
        { name: "Registro de aplicaciones", href: "/config/sub2" },
        { name: "Motivo de aplicación", href: "/config/sub2" },
        { name: "Código trazabilidad", href: "/config/sub1" },
        { name: "Hacer pedidos", href: "/config/sub2" },
        { name: "Modificar pedidos", href: "/config/sub2" },
        { name: "Ver monitoreo de plagas", href: "/config/sub2" },
        { name: "Estados y nombres de plagas", href: "/config/sub2" },
        { name: "Ver cosecha por lote", href: "/config/sub1" },
        { name: "Ver monitoreo de frutas", href: "/config/sub2" },
        { name: "Ver motivo de aplicación", href: "/config/sub2" },
      ]
    },
    {
      label: "Bodega",
      icon: <FaStore/>,
      to: "/Bodega",
      submenu: [
        { name: "Ver pedidos", href: "/config/sub1" },
        { name: "Buscar boletas", href: "/config/sub2" },
        { name: "Ver pedidos", href: "/config/sub2" },
        { name: "Buscar boletas", href: "/config/sub2" },
        { name: "Motivo de aplicación", href: "/config/sub2" },
        { name: "Código trazabilidad", href: "/config/sub1" },
        { name: "Hacer pedidos", href: "/config/sub2" },
        { name: "Modificar pedidos", href: "/config/sub2" },
        { name: "Ver monitoreo de plagas", href: "/config/sub2" },
        { name: "Estados y nombres de plagas", href: "/config/sub2" },
        { name: "Ver cosecha por lote", href: "/config/sub1" },
        { name: "Ver monitoreo de frutas", href: "/config/sub2" },
        { name: "Ver motivo de aplicación", href: "/config/sub2" },
      ]
    },
    {
      label: "Meteorologia",
      icon: <FaCloudRain />,
      to: "/Meteorologia",
      submenu: [
        { name: "Registro de pluviometros", href: "/config/sub1" },
        { name: "Registro de Lluvias", href: "/config/sub2" },
        { name: "Registro de meteorologia", href: "/config/sub2" },
        { name: "Consulta de lluvias", href: "/config/sub2" },
        { name: "Reporte de lluvias", href: "/config/sub2" },
      ]
    },
    {
      label: "LaboresCulturales",
      icon: <FaHandHoldingDroplet />,
      to: "/LaboresCulturales",
      submenu: [
        { name: "Bolestas y Programas de riego", href: "/config/sub1" },
        { name: "Programa por lote", href: "/config/sub2" },
        { name: "Buscar boletas", href: "/config/sub2" },
        { name: "Ver registros y aplicaciones", href: "/config/sub2" },
      ]
    },
    {
      label: "Planta",
      icon: <GiFactory />,
      to: "/Planta",
      submenu: [
        { name: "Labores", href: "/config/sub1" },
        { name: "Consultas de riego", href: "/config/sub2" },
        { name: "Datos", href: "/config/sub2" },
        { name: "Programas", href: "/config/sub2" },
        { name: "Productos reales aplicados", href: "/config/sub2" },
      ]
    },
  ];
  const location = useLocation();
  
  const handleMenuClick = (submenu) => {
    setActiveSubmenu(submenu);
  };

  const activeSubmenu = linksArray
  .find(link => link.to === location.pathname)
  ?.submenu || [];
  console.log("aa" + activeSubmenu);
  return (
    <>
      <div className={`grid prefers-color-scheme ${isActive ? 'grid-cols-[200px_auto]' : 'grid-cols-[90px_auto]'} bg-slate-100 dark:bg-slate-900 transition-all duration-300`}>
        <Sidebar 
        theme={theme} 
        setTheme={setTheme}
        sidebarOpen={isActive} 
        setSidebarOpen={setIsActive}
        arreglo = {linksArray}
        arreglo2 = {arrayModules}
        />
        <div className="grid">
        {activeSubmenu.length > 0 && location.pathname !== '/' && (
          <NavbarP menu={activeSubmenu} />
        )}
        <div className="px-4">
           <MyRoutes/>
        </div>
        </div>
       </div> 
    </>
  );
}
export default function WrappedApp(){
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};