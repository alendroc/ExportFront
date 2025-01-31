import { NavLink } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
 import { useLocation } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function NavbarP({ menu }){
 // console.log("Valor de menu:", menu);

  const location = useLocation();

  if (!Array.isArray(menu)) {
    console.error("menu no es un array:", menu);
    return null;
  }


/*  const widthMap = {
    "Registro de boletas más productos": "400px",
    "Actualizar Programa Operativo": "380px",
    "Otro Nombre": "350px", // Añade más nombres y anchos según sea necesario
    // Puedes continuar añadiendo más nombres y anchos aquí
  };*/


    return(
      <Disclosure as="nav" className="bg-white  dark:bg-blue-950">
        <div className="relative flex max-sm:h-16 items-center">
          <div className="ml-3 mt-2 mr-2 flex items-center justify-between w-full">
            <div className="hidden sm:block text-center">
              <div className="flex flex-wrap ">
                {menu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href }
                    className={classNames(
                      location.pathname === item.href ? 'text-lime-600 scale-110 ' : 'text-slate-500 dark:hover:text-lime-400 hover:text-lime-600',
                     
                      'rounded-md mb-2 flex w-auto mr-1 transform  font-medium py-2 px-2 2xl:text-xs text-xs  items-center hover:-translate-y-1 hover:scale-110 transition delay-75')}
                      style={{width: item.width}}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
    </Disclosure>
    );
}
export default NavbarP;