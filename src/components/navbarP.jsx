import { NavLink } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
 import { useLocation } from "react-router-dom";



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function NavbarP({ menu }){
  console.log("Valor de menu:", menu);

  const location = useLocation();

  if (!Array.isArray(menu)) {
    console.error("menu no es un array:", menu);
    return null;
  }

    return(
      <Disclosure as="nav" className="bg-white top-0  dark:bg-blue-950">
      <div className=" px- ">
        <div className="relative flex h-16 items-center">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {menu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                
                    className={classNames(
                      location.pathname === item.href ? 'text-lime-600 scale-110 ' : 'text-slate-500 dark:hover:text-lime-400 hover:text-lime-600',
                      'rounded-md  transform w-auto font-medium py-2 px-2 text-sm flex justify-center items-center hover:-translate-y-1 hover:scale-110 transition ease-in-out delay-75')}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {menu.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
    );
}
export default NavbarP;