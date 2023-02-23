import React from "react"

type SelectOption = {
  value: number
  option: string
}

export type SelectOptionProps = {
  selected?: string
  list?: SelectOption[]
  className?: string
  disabled?: boolean
  removeDefaultOption?: boolean
  onChange?: (index: string) => void
}

export default function InputSelect({
  selected = '',
  list = [],
  className,
  disabled,
  removeDefaultOption,
  onChange = () => { }
}: SelectOptionProps) {

  return (
    <div className="relative">
      <select
        className={`${className && className} ${disabled ? '' : 'hover:border-primary hover:text-gray-900 cursor-pointer'} w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-500 focus:text-gray-900 focus:outline-none focus:ring-0 focus:border-primary text-sm`}
        value={selected}
        disabled={disabled}
        onChange={(e) => {
          console.log(e.target.value)
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
  )
}