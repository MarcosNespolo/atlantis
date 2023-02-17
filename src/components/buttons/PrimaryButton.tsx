import { CheckIcon, EnvelopeIcon, MinusIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid"
import React from "react"

type ButtonProps = {
    id?: string
    className?: string
    type?: "button" | "submit" | "reset"
    text?: string
    icon?: string
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
}

export default function PrimaryButton({
    id,
    className,
    text,
    type = 'button',
    icon,
    loading = false,
    disabled = false,
    onClick = () => {}
}: ButtonProps) {

    return (
        <button
            id={id}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={
                `h-12 
                px-3
                rounded
                bg-gradient-to-br from-primary via-action-1 to-action-2
                shadow-md
                text-white text-md font-medium
                disabled:grayscale
                disabled:from-neutral-400
                disabled:to-neutral-300
                hover:saturate-150 hover:shadow-md
                active:saturate-200
                focus:ring-1 focus:outline-none focus:ring focus:ring-action-2
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