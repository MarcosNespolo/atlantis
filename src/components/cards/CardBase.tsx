import React from "react"
import { AlertMessage } from "../../utils/constants"
import CardMessage from "./CardMessage"

type CardProps = {
    children: any
    id?: string
    className?: string
    darkTheme?: boolean
    alertMessage?: AlertMessage
}

export default function Card({
    id,
    children,
    className,
    darkTheme,
    alertMessage
}: CardProps) {
    return (
        <div
            id={id}
            className={`
                h-fit
                flex flex-col
                shadow-md 
                rounded-md 
                backdrop-filter backdrop-blur
                border border-1 border-gray-200
                bg-gradient-to-br to-transparent 
                ${darkTheme ? 'from-bg-black/30 text-white' : 'from-white/50 text-gray-700'}
                ${className}
            `}>
            {alertMessage && <CardMessage message={alertMessage.message} code={alertMessage.code} />}
            {children}
        </div>
    )
}