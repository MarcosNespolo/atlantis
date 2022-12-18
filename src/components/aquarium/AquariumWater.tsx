import React from "react"

type ButtonProps = {
    className?: string
}

export default function AquariumWater({
    className,
}: ButtonProps) {

    return (
        <div
            className={`
                w-52 h-40 
                bg-blue-800/50 
                border-2 border-cyan-800/20
                absolute
                flex
                ${className}
            `}
        >
        </div>
    )
}