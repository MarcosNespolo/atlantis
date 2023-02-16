import Link from 'next/link'
import { memo } from 'react'
import SidebarMenu from './SidebarMenu'
import UserBar from './UserBar'

function Sidebar() {

    return (
        <div className="hidden md:flex md:flex-shrink-0 h-fit z-50 absolute">
            <div className="flex flex-col">
                <div className="flex flex-col w-24 flex-1 bg-primary rounded-r-xl shadow-lg">
                    <Link href={'/'}>
                        <div className="flex itens-center justify-center h-16 w-full flex-shrink-0 hover:bg-gradient-to-b from-transparent hover:via-primary-medium/50">
                            <img
                                src="/icons/atlantis_icon_white.svg"
                                alt="Logo"
                                className='object-contain my-3'
                            />
                        </div>
                    </Link>
                    <SidebarMenu />
                    <div className='h-20'></div>
                    <UserBar />
                </div>
                <div className='relative w-6 h-6 overflow-hidden'>
                    <div className='absolute w-12 h-12 rounded-full shadow-circle '>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default memo(Sidebar)