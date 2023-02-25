import React, { useState } from "react"

type SelectOption = {
  value: number
  option: string
}

export type SelectOptionProps = {
  id?: string
  label?: string
  selected?: string
  list?: SelectOption[]
  className?: string
  disabled?: boolean
  removeDefaultOption?: boolean
  onChange?: (index: string) => void
}

export default function InputSelect({
  id,
  label,
  selected = '',
  list = [],
  className,
  disabled,
  removeDefaultOption,
  onChange = () => { }
}: SelectOptionProps) {
  const [idHtmlFor, setIdHtmlFor] = useState<string>(id ? id : getIdRandom())

  function getIdRandom() {
    return Math.random().toString().split('.')[1]
  }

  return (
    <label
      className={`
            cursor-pointer
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
      {label &&
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
               text-xs
                pt-0 pl-0
            `}
        >
          {label}
        </label>
      }
      <div className="flex flex-row w-full">
        <select
          id={idHtmlFor}
          className={`
            ${className && className} 
            ${disabled
              ? ''
              : 'hover:border-primary hover:text-gray-900 cursor-pointer'} 
              w-full 
              h-4.5
              mt-1
              -ml-1
              group
              caret-gray-800 
              text-gray-500 text-base font-normal
              group-hover:text-gray-900
              group-focus-within:text-gray-900
              border-none focus:outline-none focus:ring-0
          `}
          value={selected}
          disabled={disabled}
          onChange={(e) => {
            if (typeof e?.target?.value == 'string') {
              onChange(e.target.value)
            }
          }}
        >
          {!removeDefaultOption && <option key={-1} value={''}>Selecione</option>}
          {list.map((item, i) => (
            <option key={i} value={item.value}>{item.option}</option>
          ))
          }
        </select>
      </div>
    </label>
  )
}