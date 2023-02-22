import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import { ScriptProps } from 'next/script'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState } from 'react'
import 'tailwindcss/tailwind.css'
import Image from "next/image"
import circleLoading from '../../public/circleLoading.svg'
import '../components/waves/Waves.css'
import { NewAquariumContextProvider } from '../contexts/NewAquariumContext'
import { NewFishContextProvider } from '../contexts/NewFishContext'
import icon from '../../public/icons/atlantis_icon_white.png'
import MenuLayout from '../layouts/menuLayout'
import { AuthContextProvider } from '../contexts/AuthContext'
import { SessionProvider } from 'next-auth/react';


type Page<P = Record<string, never>> = NextPage<P> & {
  Layout: (page: ScriptProps) => JSX.Element;
};

type Props = AppProps & {
  Component: Page;
};

export default function App({ Component, pageProps }: Props) {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const Layout = Component.Layout || MenuLayout;

  return (
    <>
      <Head>
        <title>Atlantis</title>
        <link rel="shortcut icon" href="/icons/atlantis_icon_white.svg" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <NewAquariumContextProvider>
          <NewFishContextProvider>
            <AuthContextProvider>
              <Layout>
                {pageLoading
                  ? <div className='flex w-full h-screen justify-center items-center'>
                    <Image src={circleLoading} width="64" height="64" alt={''} />
                  </div>
                  : <Component {...pageProps} />
                }
              </Layout>
            </AuthContextProvider>
          </NewFishContextProvider>
        </NewAquariumContextProvider>
      </SessionProvider>
      <div className='fixed -z-10 flex bottom-0 w-full h-8 bg-primary-light justify-center'>
        <Image width={40} src={icon} alt="Atlantis" />
      </div>
    </>
  )
}