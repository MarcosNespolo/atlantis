import { CheckIcon, EnvelopeIcon, MinusIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid"
import React from "react"

type ButtonProps = {
    id?: string
    className?: string
    text?: string
    icon?: string
    loading?: boolean
    disabled?: boolean
    onClick: () => void
}

export default function PrimaryButton({
    id,
    className,
    text,
    icon,
    loading,
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
            <div
                className="inline-flex items-center">
                {
                    loading ?
                        <div className='flex w-full h-screen justify-center items-center'>
                            Loading
                        </div>
                        : icon === 'cancel' ?
                            <XMarkIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                            : icon === 'trash' ?
                                <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                                : icon === 'mail' ?
                                    <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                                    : icon === 'plus' ?
                                        <PlusIcon className="h-4 w-4 mt-0.5" aria-hidden="true" />
                                        : icon === 'minus' ?
                                            <MinusIcon className="h-4 w-4 mt-0.5" aria-hidden="true" />
                                            : icon === 'edit' ?
                                                <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                                                : icon === 'check' &&
                                                <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                }
                {text}
            </div>
        </button>
    )
}