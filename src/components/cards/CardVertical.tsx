import React, { useState } from "react"
import Card from "./CardBase"

type CardProps = {
    id?: string
    children: any
    title?: string
    description?: string
    className?: string
    image?: string
    darkTheme?: boolean
    onClick?: () => void
}

export default function CardVertical({
    title,
    description,
    children,
    id,
    className,
    image,
    darkTheme,
    onClick
}: CardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Card
            id={id}
            darkTheme={darkTheme}
            className={className}
        >
            <div className="flex flex-col sm:flex-row w-full h-fit">
                {image &&
                    <div className="flex w-full sm:w-fit">
                        <img src={image} className={"w-full sm:w-96 h-full object-cover rounded-l-md shadow-lg"} />
                    </div>
                }
                <div className="h-fit w-full p-4 flex flex-col justify-between">
                    <div className="flex flex-col gap-4">
                        <span className="text-xl">{title}</span>
                        <span className="text-sm min-h-[48px]">{description}</span>
                    </div>
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </Card>
    )
}