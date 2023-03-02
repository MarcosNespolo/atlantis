import React, { useEffect, useState } from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import Slider from '@mui/material/Slider'

type InputRangeProps = {
    id?: string
    name?: string
    className?: string
    value?: number[]
    valueComparison?: (number | null)[]
    interval?: number[]
    label?: string
    step?: number
    disabled?: boolean
    onChange?: (value: number[]) => void
    onClick?: () => void
}
const finalTheme = createTheme({
    components: {
        MuiSlider: {
            styleOverrides: {
                valueLabel: ({ ownerState }) => ({
                    ...(ownerState.color === 'primary'
                        ? {
                            backgroundColor: '#71B2B5',
                        }
                        : {
                            backgroundColor: '#B91C1C',
                        }
                    ),
                    lineHeight: 1.2,
                    fontSize: 12,
                    padding: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    left: 'calc(-50% - 8px)',
                }),
                root: ({ ownerState }) => ({
                    ...(ownerState.color === 'primary'
                        ? {
                            color: '#71B2B5',
                        }
                        : {
                            color: '#e35454',
                        }
                    ),
                    height: 4,
                }),
                thumb: ({ ownerState }) => ({
                    ...(ownerState.color === 'primary'
                        ? {
                            backgroundColor: '#0396A6',
                        }
                        : {
                            backgroundColor: '#B91C1C',
                        }
                    ),
                    height: 8,
                    width: 8,
                    marginTop: 0,
                    marginLeft: 0,
                    '&:focus, &:hover, &$active': {
                        boxShadow: 'inherit',
                    },
                    '&:before': {
                        display: 'none',
                    },
                }),
                active: {},
                track: {
                    height: 4,
                    borderRadius: 2,
                },
                rail: {
                    height: 4,
                    borderRadius: 2,
                    color: '#CCC',
                },
            },
        },
    },
});

export default function InputRange({
    id,
    name,
    step = 1,
    className,
    valueComparison,
    disabled,
    interval = [0, 10],
    value = interval,
    label,
    onChange,
    onClick
}: InputRangeProps) {
    const [idHtmlFor, setIdHtmlFor] = useState<string>(id ? id : getIdRandom())
    const [isDangerSlider, setIsDangerSlider] = useState<boolean>(isCompareDangerSlider())

    useEffect(() => {
        setIsDangerSlider(isCompareDangerSlider())
    }, [value, valueComparison])

    function isCompareDangerSlider() {
        if (value.length < 2 || value[0] > value[1]) {
            return true
        }
        if (!(valueComparison && valueComparison?.length == 2 && typeof valueComparison[0] == 'number' && typeof valueComparison[1] == 'number')) {
            return false
        }
        if (value[0] > valueComparison[1] || value[1] < valueComparison[0]) {
            return true
        }
        return false
    }

    function getIdRandom() {
        return Math.random().toString().split('.')[1]
    }

    const handleSliderTempChange = (event: any, value: number | number[]) => {
        if (onChange) {
            onChange(typeof value == 'number' ? [value] : value)
        }
    };

    return (
        <label
            onClick={onClick}
            className={`
                cursor-default
                select-none
                rounded
                flex flex-col
                group
                ${className}
            `}
        >
            <label
                htmlFor={idHtmlFor}
                className={`
                    h-4
                    text-sm
                    w-full
                    items-start
                    flex justify-between 
                    text-gray-700
                    select-none	
                    cursor-default
                `}
            >
                <span className="flex font-semibold">
                    {label} {isDangerSlider && <ExclamationTriangleIcon className="w-3 mt-0.5 ml-1 text-red-700" />}
                </span>
                <span className="text-xs">
                    {value[0] <= value[1] ? `${value[0]} - ${value[1]}` : '-'}
                </span>
            </label>
            <div>
                <ThemeProvider theme={finalTheme}>
                    <Slider
                        value={value[0] <= value[1] ? value : interval}
                        onChange={handleSliderTempChange}
                        min={interval[0]}
                        max={interval[1]}
                        step={step}
                        valueLabelDisplay="auto"
                        color={isDangerSlider ? 'secondary' : 'primary'}
                    />
                </ThemeProvider>

            </div>
        </label>
    )
}