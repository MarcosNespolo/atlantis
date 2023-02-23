import React, { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuthContext } from '../../contexts/AuthContext'

function UserBar() {
  const router = useRouter()
  const path = '/'.concat(router.pathname.split('/')[1])
  const defaultNavigation = [
    { name: 'Entrar', href: '/login', icon: UserIcon },
  ]
  const [navigation, setNavigation] = useState(defaultNavigation)
  const {
    user
  } = useAuthContext()

  useEffect(() => {
    if (user) {
      setNavigation([
        { name: user.name.split(' ')[0] ?? 'Perfil', href: '/user/' + user.user_id, icon: UserIcon },
        { name: 'Sair', href: '/logout', icon: ArrowRightOnRectangleIcon },
      ])
    } else {
      setNavigation(defaultNavigation)
    }

  }, [user])

  return (
    <>
      <nav className="flex-1 pb-2 space-y-1">
        {navigation && navigation.map((item) => (
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
export default memo(UserBar)