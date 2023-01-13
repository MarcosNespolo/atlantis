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

export default function SecondaryButton({
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
            className={`h-12 px-3 flex bg-white text-cyan-600 text-md font-medium rounded shadow outline-none border border-1 border-gray-200 hover:saturate-150 hover:bg-gray-50 active:saturate-200 active:bg-gray-100 focus:ring-1 focus:outline-none focus:ring focus:ring-[#84bed1] ${className}`}>
            <div className="flex mx-auto my-auto">
                {icon &&
                    icon == 'eye'
                    ? <EyeIcon className="h-4 w-4 my-auto mr-2" aria-hidden="true" />
                    : icon == 'eye-slash' &&
                    <EyeSlashIcon className="h-4 w-4 my-auto mr-2" aria-hidden="true" />
                }
                {text}
            </div>
        </button>
    )
}