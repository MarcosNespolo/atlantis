import React from "react"

type InputTextProps = {
    className?: string
    children?: string
}

export default function H1({
    className,
    children,
}: InputTextProps) {
    return (
        <span className={className + ' ' + 'font-semibold text-3xl uppercase text-neutral-500'}>
            {children}
        </span>
    )
}