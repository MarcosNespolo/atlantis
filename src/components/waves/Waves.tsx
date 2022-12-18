import React from "react"

type WavesProps = {
    className?: string
}

export default function Waves({ className }: WavesProps) {
    return (
        <div className={`fixed w-full -z-10 ${className}`}>
            <div className="header">
                <div>
                    <svg className="waves" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink"
                        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                        <defs>
                            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g className="parallax">
                            <use xlinkHref="#gentle-wave" x="48" y="0" fill="#3A6F9E4c" />
                            <use xlinkHref="#gentle-wave" x="48" y="3" fill="#3A6F9E7f" />
                            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#3A6F9E4c" />
                            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#3A6F9ECC" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}