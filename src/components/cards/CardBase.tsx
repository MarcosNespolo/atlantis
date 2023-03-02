import React from "react"
import { AlertMessage } from "../../utils/types"
import CardMessage from "./CardMessage"

type CardProps = {
    children: any
    id?: string
    className?: string
    bgFish?: boolean
    darkTheme?: boolean
    invisibleCard?: boolean
    alertMessage?: AlertMessage | null
    onCloseMessage?: () => void
}

export default function Card({
    id,
    children,
    className,
    bgFish,
    darkTheme,
    invisibleCard,
    alertMessage,
    onCloseMessage
}: CardProps) {
    return (
        <div
            id={id}
            className={`
                h-fit
                z-10
                flex flex-col
                rounded-md 
                shadow
                backdrop-filter backdrop-blur
                ${!invisibleCard
                && 'border border-1 border-gray-200'
                }
                ${bgFish
                    ? 'bg-fish-opacity bg-center bg-contain bg-no-repeat'
                    : 'bg-gradient-to-br'
                }
                ${darkTheme ? 'from-bg-black/30 to-transparent text-white' : 'from-white/80 via-white/80 to-white/10 text-gray-700'}
                ${className}
            `}>
            {alertMessage &&
                <CardMessage
                    message={alertMessage.message}
                    code={alertMessage.code}
                    onCloseMessage={onCloseMessage}
                />
            }
            {children}
        </div>
    )
}