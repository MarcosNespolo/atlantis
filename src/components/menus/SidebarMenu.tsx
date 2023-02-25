import React, { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { useAuthContext } from '../../contexts/AuthContext'

function SidebarMenu() {
  const router = useRouter()
  const path = '/'.concat(router.pathname.split('/')[1])
  const {
    user
  } = useAuthContext()

  const defaultNavigation = [
    { name: 'Aquário', href: '/newAquarium', icon: GlobeAmericasIcon },
  ]

  const specialistNavigation = [
    { name: 'Espécies', href: '/fish', icon: GlobeAmericasIcon },
    { name: 'Alimentos', href: '/food', icon: GlobeAmericasIcon },
    { name: 'Substratos', href: '/substrate', icon: GlobeAmericasIcon },
  ]

  const adminNavigation = [
    { name: 'Usuários', href: '/user', icon: GlobeAmericasIcon },
  ]

  const [navigation, setNavigation] = useState<any>([])

  useEffect(() => {
    if (user?.role_id) {
      switch (user.role_id) {
        case 1:
          setNavigation(defaultNavigation)
          break
        case 2:
          setNavigation([...defaultNavigation, ...specialistNavigation])
          break
        case 3:
          setNavigation([...defaultNavigation, ...specialistNavigation, ...adminNavigation])
          break
        default:
          setNavigation(defaultNavigation)
      }
    } else {
      setNavigation([])
    }
  }, [user])

  return (
    <>
      <nav className="flex-1 pb-2 space-y-1">
        {navigation && navigation.map((item: any) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
            flex flex-col 
            items-center text-center 
            p-2 
            rounded-r-xl
            font-medium
            text-sm text-white
            hover:text-white
            ${item.href == path ? 'bg-primary-medium' : 'hover:bg-gradient-to-b from-transparent hover:via-primary-medium/50'}
            group
          `}
          >
            <item.icon
              className='flex-shrink-0 h-6 w-6'
              aria-hidden="true"
            />
            {item.name}
          </Link>

        ))}
      </nav>
    </>
  )
}
export default memo(SidebarMenu)