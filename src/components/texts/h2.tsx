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
        <span className={className + ' ' + 'font-semibold text-sm sm:text-lg text-[#0B698B]/80 tracking-wide uppercase'}>
            {children}
        </span>
    )
}