import React, { useEffect, useState } from "react"
import { Slider, withStyles } from '@material-ui/core';


const MySlider = withStyles({
    root: {
        color: '#71B2B5',
        height: 4,
    },
    thumb: {
        height: 8,
        width: 8,
        backgroundColor: '#0396A6',
        marginTop: -2,
        marginLeft: 0,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% - 8px)',
    },
    track: {
        height: 4,
        borderRadius: 2,
        marginLeft: 4,
    },
    rail: {
        height: 4,
        borderRadius: 2,
        color: '#CCC',
    },
})(Slider);

type InputRangeProps = {
    id?: string
    name?: string
    className?: string
    value?: number[]
    interval?: number[]
    label?: string
    step?: number
    disabled?: boolean
    onChange?: (value: string) => void
    onClick?: () => void
}

export default function InputRange({
    id,
    name,
    step = 1,
    className,
    value = [0, 10],
    disabled,
    interval = [0, 10],
    label,
    onChange,
    onClick
}: InputRangeProps) {
    const [idHtmlFor, setIdHtmlFor] = useState<string>(id ? id : getIdRandom())
    const [temperatura, setTemperatura] = useState([0, 30]);

    function getIdRandom() {
        return Math.random().toString().split('.')[1]
    }

    function getOnlyNumbers(val: string) {
        return val.replace(/\D/g, '')
    }

    function changeValue(value: string) {
        if (onChange) {
            onChange(value)
        }
    }

    const handleSliderTempChange = (event: any, value: any) => {
        setTemperatura(value);
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
                <span className="font-semibold">
                    {label}
                </span>
                <span className="text-xs">
                    {value[0]} - {value[1]}
                </span>
            </label>
            <div>
                <MySlider
                    value={value}
                    onChange={handleSliderTempChange}
                    onChangeCommitted={(e, val) => !disabled && console.log(val)}
                    min={interval[0]}
                    max={interval[1]}
                    step={step}
                    valueLabelDisplay="auto"
                />
            </div>
        </label>
    )
}