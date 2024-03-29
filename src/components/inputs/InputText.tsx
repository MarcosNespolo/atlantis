import React, { useEffect, useState } from "react"

type InputTextProps = {
    id?: string
    name?: string
    className?: string
    value?: string | number
    label?: string
    complementText?: string
    onlyNumbers?: boolean
    isPassword?: boolean
    lines?: number
    disabled?: boolean
    onChange?: (value: any) => void
    onClick?: () => void
}

export default function InputText({
    id,
    name,
    className,
    value = '',
    label,
    complementText,
    onlyNumbers,
    isPassword = false,
    lines = 1,
    disabled = false,
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
                hover:border-[#84bed1]
                focus-within:border-[#84bed1]
                group
                ${disabled ? 'bg-gray-100' : 'bg-white'}
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
                    ${(value.toString() != '') ? 'text-xs' : 'text-md'}
                    ${(value.toString() != '') ? 'pt-0 pl-0' : 'pt-2.5 pl-2'}
                `}
            >
                {label}
            </label>
            <div className="flex flex-row w-full">
                {lines > 1
                    ? <textarea
                        id={idHtmlFor}
                        disabled={disabled}
                        value={value}
                        rows={lines}
                        onChange={(e) => changeValue(e.target.value)}
                        className={`
                            w-full
                            mt-1
                            group
                            caret-gray-800 
                            text-gray-500 text-base font-normal
                            group-hover:text-gray-900
                            group-focus-within:text-gray-900
                            appearance-none focus:outline-none focus:ring-0
                        `}
                    />
                    : <input
                        id={idHtmlFor}
                        disabled={disabled}
                        value={value}
                        type={isPassword ? 'password' : 'text'}
                        onChange={(e) => changeValue(e.target.value)}
                        className={`
                            w-full
                            h-4.5
                            mt-1
                            group
                            caret-gray-800 
                            text-gray-500 text-base font-normal
                            group-hover:text-gray-900
                            group-focus-within:text-gray-900
                            appearance-none focus:outline-none focus:ring-0
                        `}
                    />
                }
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
                            ${(value.toString() != '') ? 'visible' : 'invisible'}
                        `}
                    >
                        {complementText}
                    </label>
                }
            </div>
        </label>
    )
}