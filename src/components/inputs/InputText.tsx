import React, { useEffect, useState } from "react"

type InputTextProps = {
    id?: string
    name?: string
    className?: string
    value?: string | number
    label?: string
    complementText?: string
    onlyNumbers?: boolean
    onChange?: (value: string) => void
    onClick?: () => void
}

export default function InputText({
    id,
    name,
    className,
    value,
    label,
    complementText,
    onlyNumbers,
    onChange,
    onClick
}: InputTextProps) {
    const [idHtmlFor, setIdHtmlFor] = useState<string>(id ? id : getIdRandom())

    function getIdRandom() {
        return Math.random().toString().split('.')[1]
    }

    function getOnlyNumbers(val: string) {
        return val.replace(/\D/g, '')
    }

    function changeValue(value: string) {
        if (onlyNumbers) {
            value = getOnlyNumbers(value)
        }
        if (onChange) {
            onChange(value)
        }
    }

    return (
        <label
            onClick={onClick}
            className={`
                cursor-text
                p-1.5
                rounded
                flex flex-col
                border border-1
                bg-white
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
                    select-none	
                    cursor-text
                    group-hover:text-[#84bed1]
                    group-focus-within:text-xs
                    group-focus-within:pt-0
                    group-focus-within:pl-0
                    group-focus-within:text-[#84bed1]
                    ${(value && value?.toString().length > 0) ? 'text-xs' : 'text-md'}
                    ${(value && value?.toString().length > 0) ? 'pt-0 pl-0' : 'pt-2 pl-2'}
                `}
            >
                {label}
            </label>
            <div>
                <input
                    id={idHtmlFor}
                    value={value}
                    onChange={(e) => changeValue(e.target.value)}
                    className={`
                    w-fit
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
                {complementText &&
                    <label
                        htmlFor={idHtmlFor}
                        className={`
                            h-4
                            z-10
                            text-sm
                            text-gray-400
                            select-none	
                            cursor-text
                            group-hover:text-[#84bed1]
                            group-focus-within:text-[#84bed1]
                            group-focus-within:visible
                            ${(value && value?.toString().length > 0) ? 'visible' : 'invisible'}
                        `}
                    >
                        {complementText}
                    </label>
                }
            </div>
        </label>
    )
}