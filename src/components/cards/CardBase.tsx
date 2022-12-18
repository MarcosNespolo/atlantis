import React from "react"

type CardProps = {
    children: any
    id?: string
    className?: string
    darkTheme?: boolean
}

export default function Card({
    id,
    children,
    className,
    darkTheme,
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
            {children}
        </div>
    )
}