import logo from "../assets/react.svg"
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";;
import Box from '@mui/material/Box';
import { UsuarioService } from "../services/UsuarioService";
import Modal from '@mui/material/Modal';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Tooltip, responsiveFontSizes } from "@mui/material";
import { showToast } from "./helpers";
import React , { useEffect, useState } from "react";

var usuarioService = new UsuarioService;
export function Sidebar({theme, setTheme, sidebarOpen, setSidebarOpen, arreglo, arreglo2, arreglo3}) {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [nombreUsuario, setNombreUsuario] = useState('')

  useEffect(() => {
    // Recuperar el usuario desde sessionStorage y actualizar el estado
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuario && usuario.usuario) {
        setNombreUsuario(usuario.usuario);
        console.log(nombreUsuario)
    }
}, []);

/*mensajes*/
const [passwordActual, setPasswordActual] = useState('');
const [nuevaPassword, setNuevaPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [mensajeError, setMensajeError] = useState('');

const cambiarContraseña = (e) => {
  e.preventDefault();
  const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
  console.log(passwordActual)
  if (!usuarioActual) {
    setMensajeError('No hay un usuario autenticado.');
    return;
  }
  // Verificar la contraseña actual
  if (usuarioActual.contrasena !== passwordActual) {
    setMensajeError('La contraseña actual es incorrecta.');
    return;
  }
  if (usuarioActual.contrasena === nuevaPassword) {
    setMensajeError('La nueva contraseña debe ser diferente a la actual.');
    return;
  }
  
  // Verificar que las nuevas contraseñas coincidan
  if (nuevaPassword !== confirmPassword) {
    setMensajeError('Las contraseñas nuevas no coinciden.');
    return;
  }
  usuarioActual.contrasena = nuevaPassword;
  usuarioService.update(usuarioActual.usuario, usuarioActual).
  then(response =>{
    if (response.success) {
      sessionStorage.setItem('usuario', JSON.stringify(usuarioActual));
      showToast('success', 'Cambio de contraseña listo', '#2d800e');
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmPassword('');
      setMensajeError('');
     handleClose();
    }else {

    }}).catch(error => {
      console.log(`Error de red: ${error.message}`);
  });
};
  const CambiarSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleThemeChange = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  };

  const styleBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };
  return (
  
  <div className="flex flex-col bg-white z-40 dark:bg-blue-950 dark:text-slate-300  text-slate-500 text-3xl sticky top-0 h-screen  font-roboto font-medium">
    <div className={`sticky top-0 z-10 cursor-pointer contenido ml-[10%] bg-white pt-[20px] flex  items-center ${sidebarOpen ? 'text-2xl justify-star' : 'justify-center'} pb-[20px] transition duration-150 ease-in`}
    onClick={CambiarSidebar}>
      <div >
      <img src={logo} className={`flex items-center max-w-[100%] h-auto ${sidebarOpen ? 'scale-[0.7]' : 'scale-[1.5]'}`}/>
      </div>
      {sidebarOpen && 
      <h2 className={`font-medium whitespace-nowrap overflow-hidden opacity-1 transition-opacity duration-300 `}>ExporPack</h2>}
    </div>
    
    <div className=" overflow-y-auto max-h-[calc(100vh-150px)] 2xl:text-base text-sm scrollbar-thumb-rounded-full  scrollbar-track-gray-100 ">
    {arreglo.map(({ icon, label, to, submenu}) =>(
      <div className=" " key={label}>
      <Tooltip
      title={label}
      arrow
      disableHoverListener={sidebarOpen}
      placement="right-end">  
      <NavLink 
        to={to}

        className={`flex items-center over mb-4 max-100%:mb-3 ml-[5%] mr-0 transition-colors duration-200 hover:bg-indigo-50 rounded-l-lg 
        ${location.pathname === to || submenu.some(sub => location.pathname === sub.href) ? 'text-lime-600 bg-slate-200 border-r-4 border-r-lime-600' : ''} 
        ${sidebarOpen ? '':'justify-center '}`}
       >

        <div className="Linkicon p-2 text-2xl">{icon}</div>
        {sidebarOpen && <span className="ml-3  overflow-hidden transition-opacity duration-300">{label}</span>}
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
        className={`flex items-center mb-4 max-2xl:mb-3 ml-[5%] mr-0 transition-colors duration-200 hover:bg-indigo-50 rounded-l-lg
        ${location.pathname === to  || submenu.some(sub => location.pathname === sub.href) ? 'text-lime-600 bg-slate-200 border-r-4 border-r-lime-600' : ''} 
        ${sidebarOpen ? '':'justify-center'}`}
       >
        <div className="Linkicon p-2 text-2xl">{icon}</div>

        {sidebarOpen && <span className="ml-3  whitespace-nowrap  overflow-hidden transition-opacity duration-300">{label}</span>}

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
    className={`flex items-center mb-4 max-2xl:mb-2 ml-[5%] mr-0 transition-colors duration-200 hover:bg-indigo-50 rounded-l-lg
    ${location.pathname === to  || submenu.some(sub => location.pathname === sub.href) ? 'text-lime-600 bg-slate-200 border-r-4 border-r-lime-600' : ''} 
    ${sidebarOpen ? '':'justify-center'}`}
   >
    <div className="Linkicon p-2 text-2xl">{icon}</div>
    {sidebarOpen && <span className="ml-3  overflow-hidden transition-opacity duration-300">{label}</span>}
  </NavLink>
  </Tooltip>
</div>
))}
</div> 

 <div className="min-w-full:absolute bottom-0 w-full max-100%:static bg-white dark:bg-blue-950">
    <DividerImbicible/>
    <div className={`flex items-center px-2 ${sidebarOpen ? 'justify-between':'justify-center'}`}>
      {sidebarOpen && <span className="text-sm py-2 opacity-1 transition-opacity duration-300 whitespace-nowrap overflow-hidden">modo oscuro</span>}
      <Swichito>
        <input type="checkbox" onClick={handleThemeChange}/>
        <span className="slider"></span>
      </Swichito>
    </div>

    <Divider/>
    <div className="flex items-center pr-2 mb-2">
      <Menu as="div" className="relative w-full ">
        <div className="flex justify-center w-full">
          <MenuButton className={`relative bg-gray-100 border-b-2 border-b-green-900 text-green-900 flex rounded-l-lg space-x-2 items-center text-sm ${sidebarOpen ? 'w-[90%]' : ' border-b-0 rounded-lg justify-center'}`}>
          <div className="h-12 w-12 rounded-md bg-green-900 text-white flex items-center justify-center">
           {nombreUsuario && nombreUsuario.charAt(0).toUpperCase()}
          </div>
            {sidebarOpen && <span className="pr-3 overflow-hidden text-sm">{nombreUsuario}</span>}
          </MenuButton>
        </div>
        <MenuItems
          transition
          className={`absolute z-50 w-48 origin-bottom-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition ease-out duration-100 
          ${sidebarOpen ? 'right-[-90%]  -bottom-1' : 'right-[-200px]  -bottom-1'}`}
        >
          <MenuItem>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
              Your Profile
            </a>
          </MenuItem>
          <MenuItem onClick={handleOpen}>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
             Cambiar contraseña
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/" className="block px-4 py-2 text-sm text-red-500 data-[focus]:bg-gray-100">
              Cerrar Sesión
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  </div>
  <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleBox} className="rounded-xl">
        <form onSubmit={cambiarContraseña}>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 w-96">
        <div class="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Cambiar contraseña
              </p> 
              {mensajeError && <p className="text-red-500">{mensajeError}</p>}
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">
                  Tu contraseña
                </label>
                <input placeholder="•••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" id="password" type="password"  value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}/>
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">
                  Nueva contraseña
                </label>
                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="nuevaPassword" type="password"  value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}/>
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">
                  Confirma contraseña
                </label>
                <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="confirmPassword" type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
              </div>
              <button class="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white" type="submit">
                cambiar contraseña
              </button>
          </div>
        </div>
      </div></form>
        </Box>
      </Modal>
</div>
  );
}

const Swichito = styled.label`
  display: block;
  --width-of-switch: 2em;
  --height-of-switch: 1em;
  --size-of-icon: 0.7em;
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