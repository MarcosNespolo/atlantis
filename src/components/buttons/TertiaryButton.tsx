import React from "react"
import styled from 'styled-components'
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

type ButtonProps = {
    id?: string
    className?: string
    text?: string
    icon?: string
    onClick: () => void
}

export default function TertiaryButton({
    id,
    className,
    text,
    onClick,
    icon
}: ButtonProps) {

    return (
        <button
            id={id}
            key={id}
            onClick={onClick}
            className={`
                h-10 px-3 
                flex 
                bg-transparent 
                rounded-md 
                text-cyan-600 text-sm font-medium 
                outline-none 
                hover:saturate-150 hover:bg-gray-100/50 
                active:saturate-200 active:bg-gray-100 
                focus:ring-1 focus:outline-none focus:ring focus:ring-[#84bed1] ${className}
            `}>
            <div className="flex mx-auto my-auto">
                {text}
            </div>
        </button>
    )
}