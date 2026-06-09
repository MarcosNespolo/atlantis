import React, { memo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline'

// Navegação pública (sem login). As seções por-papel voltam quando a auth for reativada.
function SidebarMenu() {
  const router = useRouter()
  const path = '/'.concat(router.pathname.split('/')[1])

  const navigation = [
    { name: 'Aquário', href: '/newAquarium', icon: GlobeAmericasIcon },
    { name: 'Espécies', href: '/fish', icon: GlobeAmericasIcon },
  ]

  return (
    <>
      <nav className="flex-1 pb-2 space-y-1">
        {navigation.map((item) => (
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
