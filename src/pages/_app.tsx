import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'
import 'tailwindcss/tailwind.css'
import Image from "next/image"
import circleLoading from '../../public/circleLoading.svg'
import '../components/waves/Waves.css'
import { NewAquariumContextProvider } from '../contexts/NewAquariumContext'
import icon from '../../public/icons/icon-white.png'
import Waves from '../components/waves/Waves'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>Atlantis</title>
        <link rel="shortcut icon" href="/icons/icon-white.png" />
      </Head>
      <NewAquariumContextProvider>
        {pageLoading
          ? <div className='flex w-full h-screen justify-center items-center'>
            <Image src={circleLoading} width="64" height="64" alt={''} />
          </div>
          : <Component {...pageProps} />
        }
      </NewAquariumContextProvider>
      <div className='fixed -z-10 flex bottom-0 w-full h-8 bg-primary-dark justify-center'>
        <Image width={40} src={icon} alt="Atlantis" />
      </div>
      <Waves className="rotate-180 -z-20 -top-0 opacity-30" />
      <Waves className="-bottom-0 -z-20 opacity-30" />
    </>
  )
}
