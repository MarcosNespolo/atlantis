import React from "react"

type InputTextProps = {
    className?: string
    children?: string
}

export default function H2({
    className,
    children,
}: InputTextProps) {
    return (
        <span className={className + ' ' + 'font-medium text-xl text-neutral-500 tracking-wide'}>
            {children}
        </span>
    )
}