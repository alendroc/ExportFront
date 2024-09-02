import { MyRoutes } from "./routers/routes"; // Asegúrate de que sea un componente React
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import React, { useState, useEffect } from "react";
import { NavbarP } from "./components/navbarP";
import { AiFillMeh,AiOutlineLeft,
  AiOutlineHome,
  AiOutlineApartment,} from "react-icons/ai";
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
  const location = useLocation();
  /*
  const handleMenuClick = (submenu) => {
    setActiveSubmenu(submenu);
  };*/

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