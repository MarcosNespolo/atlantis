import React from "react"

type ButtonProps = {
    className?: string
}

export default function AquariumWall({
    className,
}: ButtonProps) {

    return (
        <div
            className={`
                w-52 h-52 
                bg-cyan-100/50
                border-2 border-cyan-800/30
                absolute
                flex
                ${className}
            `}
        >
        </div>
    )
}