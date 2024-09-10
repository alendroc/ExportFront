import logo from "../assets/react.svg"
import styled from "styled-components";

import { NavLink, useLocation } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Tooltip } from "@mui/material";

export function Sidebar({theme, setTheme, sidebarOpen, setSidebarOpen, arreglo, arreglo2, arreglo3}) {
  const location = useLocation();


  const CambiarSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleThemeChange = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  };

  return (
  
  <div className="bg-white dark:bg-blue-950 dark:text-slate-300 text-slate-500 text-3xl sticky top-0 h-screen pt-[20px] font-roboto font-medium"
  >
    <div className={`cursor-pointer contenido flex justify-center items-center ${sidebarOpen ? 'text-2xl' : ''} pb-[20px] transition duration-150 ease-in`}
    onClick={CambiarSidebar}>
      <div >
      <img src={logo} className={`flex items-center max-w-[100%] h-auto ${sidebarOpen ? 'scale-[0.7]' : 'scale-[1.5]'}`}/>
      </div>
      {sidebarOpen && 
      <h2 className={`font-medium whitespace-nowrap overflow-hidden opacity-1 transition-opacity duration-300 `}>ExportPack</h2>}
    </div>

    {arreglo.map(({ icon, label, to, submenu}) =>(
      <div className=" " key={label}>
      <Tooltip
      title={label}
      arrow
      disableHoverListener={sidebarOpen}
      placement="right-end">  
      <NavLink 
        to={to}

        className={`flex items-center over mb-3 ml-[15%] mr-0 transition-colors duration-200 hover:bg-indigo-50 rounded-l-lg 
        ${location.pathname === to || submenu.some(sub => location.pathname === sub.href) ? 'text-lime-600 bg-slate-200 border-r-4 border-r-lime-600' : ''} 
        ${sidebarOpen ? '':'justify-center '}`}
       >

        <div className="Linkicon p-2 text-2xl">{icon}</div>
        {sidebarOpen && <span className="ml-3 text-xs  overflow-hidden transition-opacity duration-300">{label}</span>}
      </NavLink>
</Tooltip>
    </div>
    ))}

    <DividerImbicible/>
   
    {arreglo2.map(({ icon, label, to, submenu}) =>(
      <div className=" " key={label}> 
      <Tooltip
      title={label}
      arrow
      disableHoverListener={sidebarOpen}
      placement="right-end">
     <NavLink 
        to={to}
        className={`flex items-center mb-3 ml-[15%] mr-0 transition-colors duration-200 hover:bg-indigo-50 rounded-l-lg
        ${location.pathname === to  || submenu.some(sub => location.pathname === sub.href) ? 'text-lime-600 bg-slate-200 border-r-4 border-r-lime-600' : ''} 
        ${sidebarOpen ? '':'justify-center'}`}
       >
        <div className="Linkicon p-2 text-2xl">{icon}</div>

        {sidebarOpen && <span className="ml-3 text-sm whitespace-nowrap  overflow-hidden transition-opacity duration-300">{label}</span>}

      </NavLink>
      </Tooltip>
    </div>
    ))}
     <DividerImbicible/>
    
{arreglo3.map(({ icon, label, to, submenu}) =>(
  <div className=" " key={label}> <Tooltip
      title={label}
      arrow
      disableHoverListener={sidebarOpen}
      placement="right-end">
 <NavLink 
    to={to}
    className={`flex items-center mb-3 ml-[15%] mr-0 transition-colors duration-200 hover:bg-indigo-50 rounded-l-lg
    ${location.pathname === to  || submenu.some(sub => location.pathname === sub.href) ? 'text-lime-600 bg-slate-200 border-r-4 border-r-lime-600' : ''} 
    ${sidebarOpen ? '':'justify-center'}`}
   >
    <div className="Linkicon p-2 text-2xl">{icon}</div>
    {sidebarOpen && <span className="ml-3 text-sm overflow-hidden transition-opacity duration-300">{label}</span>}
  </NavLink>
  </Tooltip>
</div>
))}
    
  <Divider/>
  <div className={`flex items-center  px-2
   ${sidebarOpen ? 'justify-between':'justify-center'}`}>
  {sidebarOpen && <span className="text-xs py-2 opacity-1 transition-opacity duration-300 whitespace-nowrap overflow-hidden">Dark mode</span>}
  
  <Swichito >
    <input type="checkbox" onClick={handleThemeChange}/>
    <span className="slider"></span>
  </Swichito>

 </div>

 <Divider/>
 <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            <Menu as="div" className="relative">
              <div className="felx">
                <MenuButton className={`relative bg-gray-100 border-b-2 border-b-green-900 text-green-900 flex  rounded-l-lg space-x-2 items-center text-sm ${sidebarOpen ?'w-[90%]':'w-[100%]'}`}>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className={`h-12 w-12 rounded-md`}
                  />
                  {sidebarOpen&&<span className="pr-3 overflow-hidden ">Jose alejandro Chaves </span>}
                </MenuButton>
                
              </div>
              <MenuItems
                transition
                className={`absolute  mb-2 z-10 w-48 origin-bottom-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition ease-out duration-100 
                ${sidebarOpen ?'right-[-80%]  -bottom-3':'right-[-185px]  -bottom-3'}`}
              >
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
    </div>
  
  );
}




const Swichito = styled.label`
  display: block;
  --width-of-switch: 2em;
  --height-of-switch: 1em;
  /* size of sliding icon -- sun and moon */
  --size-of-icon: 0.7em;
  /* it is like a inline-padding of switch */
  --slider-offset: 0.2em;
  position: relative;
  width: var(--width-of-switch);
  height: var(--height-of-switch);

  input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(101 163 13);
  transition: .4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: var(--size-of-icon,1.4em);
  width: var(--size-of-icon,1.4em);
  border-radius: 20px;
  left: var(--slider-offset,0.3em);
  top: 50%;
  transform: translateY(-50%);
  background: white;
  ;
 transition: .4s;
}

input:checked + .slider {
  background-color: #303136;
}

input:checked + .slider:before {
  left: calc(100% - (var(--size-of-icon,1.4em) + var(--slider-offset,0.3em)));
  background: #303136;
  /* change the value of second inset in box-shadow to change the angle and direction of the moon  */
  box-shadow: inset -3px -2px 5px -2px #8983f7, inset -10px -4px 0 0 #a3dafb;
}
  
`

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: rgb(230,230,230);
  margin: 24px 0;
`;
const DividerImbicible = styled.div`
  height: 1px;
  width: 100%;
  background: rgba(230, 230, 230, 0);
  margin: 10px 0;
`;