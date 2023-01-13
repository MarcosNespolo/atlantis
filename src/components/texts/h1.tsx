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
        <span className={className + ' ' + 'font-regular text-2xl sm:text-3xl text-neutral-500/90'}>
            {children}
        </span>
    )
}