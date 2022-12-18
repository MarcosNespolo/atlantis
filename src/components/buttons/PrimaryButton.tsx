import React from "react"
import styled from 'styled-components'

type ButtonProps = {
    id?: string
    className?: string
    text?: string
    disabled?: boolean
    onClick: () => void
}

export default function PrimaryButton({
    id,
    className,
    text,
    disabled = false,
    onClick
}: ButtonProps) {

    return (
        <button
            id={id}
            onClick={onClick}
            disabled={disabled}
            className={
                `h-10 
                px-3
                rounded
                bg-gradient-to-r from-[#0B698B] to-[#0396A6]
                shadow-md
                text-white text-sm font-medium
                disabled:grayscale
                disabled:from-[#a0a0a0]
                disabled:to-[#d6d6d6]
                hover:saturate-150 hover:shadow-md
                active:saturate-200
                focus:ring-1 focus:outline-none focus:ring focus:ring-[#84bed1]
                ${className}
            `}>
            {text}
        </button>
    )
}