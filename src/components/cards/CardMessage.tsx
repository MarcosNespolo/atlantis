import { XMarkIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { ALERT_MESSAGE_CODE } from "../../utils/constants"
import { AlertMessage } from "../../utils/types"

export default function CardMessage({ message, code }: AlertMessage) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        setIsOpen(true)
    }, [message])

    if (!isOpen) {
        return <></>
    }

    return (
        <div
            className={`
                absolute flex flex-row gap-1 text-xs font-medium top-0 right-0 w-fit pl-2 items-center rounded-bl-xl rounded-tr shadow
                ${code == ALERT_MESSAGE_CODE.SUCCESS
                    ? ' text-green-800 bg-green-500/30'
                    : code == ALERT_MESSAGE_CODE.DANGER
                        ? ' text-red-800 bg-red-500/30'
                        : ' text-yellow-800 bg-yellow-500/30'
                }
            `}
        >
            {message}
            <div
                onClick={() => setIsOpen(false)}
                className={`
                    w-fit h-fit p-1 bg-transparent cursor-pointer rounded-tr-md hover:shadow-inner
                    ${code == ALERT_MESSAGE_CODE.SUCCESS
                        ? ' hover:bg-green-500/40'
                        : code == ALERT_MESSAGE_CODE.DANGER
                            ? ' hover:bg-red-500/60'
                            : ' hover:bg-yellow-500/60'
                    }
                `}
            >
                <XMarkIcon className="h-4 w-4" />
            </div>
        </div>
    )
}