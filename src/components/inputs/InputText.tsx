import React, { useEffect, useState } from "react"

type InputTextProps = {
    id?: string
    name?: string
    className?: string
    value?: string
    label?: string
    onChange: (value: string) => void
    onClick: () => void
}

export default function InputText({
    id,
    name,
    className,
    value,
    label,
    onChange,
    onClick
}: InputTextProps) {
    const [idHtmlFor, setIdHtmlFor] = useState<string>(id ? id : getIdRandom())

    function getIdRandom() {
        return Math.random().toString().split('.')[1]
    }

    return (
        <div 
            onClick={onClick}
            className={`
                cursor-text
                p-1.5
                rounded
                flex flex-col
                border border-1
                hover:border-[#84bed1]
                focus-within:border-[#84bed1]
                group
                ${className}
            `}
        >
            <label
                htmlFor={idHtmlFor}
                className={`
                    h-4
                    w-full
                    z-10
                    text-gray-400
                    cursor-text
                    group-hover:text-[#84bed1]
                    group-focus-within:text-xs
                    group-focus-within:pt-0
                    group-focus-within:pl-0
                    group-focus-within:text-[#84bed1]
                    ${(value && value?.length > 0) ? 'text-xs' : 'text-md'}
                    ${(value && value?.length > 0) ? 'pt-0 pl-0' : 'pt-1.5 pl-2'}
                `}
            >
                {label}
            </label>
            <input
                id={idHtmlFor}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    h-4
                    mt-1
                    group
                    caret-gray-800 
                    text-gray-500 text-base font-normal
                    group-hover:text-gray-900
                    group-focus-within:text-gray-900
                    appearance-none focus:outline-none focus:ring-0
                `}
            />
        </div>
    )
}