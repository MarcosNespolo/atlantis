import React, { Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Sidebar from '../components/menus/Sidebar'
import UserBar from '../components/menus/UserBar'
// import { Dialog, Transition } from '@headlessui/react'
// import { XIcon } from '@heroicons/react/outline'
// import Sidebar from '../components/Sidebar'
// import Topbar from '../components/Topbar'
// import { useDashboardContext } from '../contexts/DashboardContext'
// import { isAdminUser, isManagerUser } from '../services/auth/permissionProvider'

function MenuLayout({ children }: any) {
  const router = useRouter()
  const path = '/'.concat(router.pathname.split('/')[1])
  //const { defaultNavigation, adminNavigation, TroquecommerceNavigation, navigation, setNavigation, sidebarOpen, setOpenSlidebar } = useDashboardContext()

  // useEffect(() => {
  //   if (children[0].props.profile) {
  //     let adminNav = children[0].props.profile.canApplyForRetention ? adminNavigation : adminNavigation.filter((nav) => nav.name != 'Retenção')
  //     // if (isManagerUser(children[0].props.profile.roleId)) {
  //     //   setNavigation([...defaultNavigation, ...adminNav, ...TroquecommerceNavigation])
  //     // } else if (isAdminUser(children[0].props.profile.roleId)) {
  //     //   setNavigation([...defaultNavigation, ...adminNav])
  //     // }
  //     // else {
  //       setNavigation(defaultNavigation)
  //    // }
  //   }
  // }, [children[0].props.profile])

  return (
    <div className="h-screen flex overflow-hidden bg-seabed bg-right-bottom bg-no-repeat bg-contain ">
      {/* <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 xl:hidden"
          open={sidebarOpen}
          onClose={setOpenSlidebar}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setOpenSlidebar(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex items-center h-16 flex-shrink-0 px-4 self-center">
                <Image
                  src="/SVG/logo_horizontal_branco.svg"
                  alt="Workflow"
                  width={200}
                  height={26}
                  layout="intrinsic"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation && navigation?.map((item: any) => (
                    <Link
                      key={item.name}
                      href={item.href}
                    >
                      <a
                        onClick={() => setOpenSlidebar(false)}
                        className={`
                        ${item.href == path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        `}>
                        <item.icon
                          className={`
                            ${item.href == path ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}
                            'mr-4 flex-shrink-0 h-6 w-6'
                          `}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  )
                  )}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
          </div>
        </Dialog>
      </Transition.Root> */}

      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* <Topbar baseUrl={children[0].props.baseUrl} profile={children[0].props.profile} notification={children[0].props.notification} /> */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden focus:outline-none">
          <div className="">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MenuLayout