import PrimaryButton from "../components/buttons/PrimaryButton"
import Card from "../components/cards/CardBase"
import MenuLayout from "../layouts/menuLayout"
import Router from 'next/router'

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-fit md:mx-28">
        <div className="flex flex-col sm:flex-row w-full max-w-4xl">
          <div className="w-full sm:w-1/3 flex items-center justify-center bg-action-1/40">
            <img className="w-full max-w-sm h-auto p-8" src={'/img/fish.png'} alt={''} />
          </div>
          <div className="flex flex-col w-full sm:w-2/3 p-8 gap-8">
            <div className="flex flex-row w-full items-end justify-between gap-8">
              {/* <img
                src="/icons/atlantis_icon.svg"
                alt="Logo"
                className='w-20 object-contain -mb-6'
              /> */}
              <span className="font-light text-3xl text-action-2 subpixel-antialiased">
                Atlantis
              </span>
            </div>
            <div className="flex flex-col w-full max-w-xl gap-8">
              <div className="text-primary-dark text-3xl">
                Transforme seu aquário em um verdadeiro lar para seus peixes
              </div>
              <div className="text-neutral-500/90 text-lg">
                A Atlantis é uma ferramenta gratuita que pode ajudar você a planejar o seu aquário, escolher uma fauna aquática compatível e descobrir os parâmetro ideais para manter um ambiente saudável e equilibrado.
              </div>
              <PrimaryButton
                className="w-full md:w-fit pl-4 pr-4"
                text='Planejar Aquário'
                onClick={() => Router.push('/newAquarium')}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

Home.Layout = MenuLayout