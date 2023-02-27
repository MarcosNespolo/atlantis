import Image from 'next/image'
import { ChangeEventHandler } from 'react'

export type UploadButtonProps = {
    onUpload: ChangeEventHandler<HTMLInputElement>
    loading: boolean
    image?: string
    name?: string
    id?: number
    className?: string
}

export default function ImageButton({
    onUpload,
    loading = false,
    image = '',
    name = '',
    id = 0,
    className
}: UploadButtonProps) {
    return (
        <div className={`flex flex-col items-end h-52 w-full sm:w-48 mb-2 rounded bg-primary-light/30 border border-primary-light ${className}`}>
            {image && !loading ?
                <>
                    <img
                        className="w-full h-full max-h-40 object-cover rounded-t"
                        src={image}
                        alt={name}
                    />
                </> :
                loading ?
                    <Image src={'/circleLoading.svg'} width="64" height="64" alt={''} />
                    :
                    <></>
            }
            <div className={`relative w-full mt-auto`}>
                <label
                    className={`cursor-pointer h-12 px-3 flex items-center text-center justify-center bg-white text-cyan-600 text-md font-medium rounded-b shadow outline-none border-t border-1 border-gray-200 hover:saturate-150 hover:bg-gray-50 active:saturate-200 active:bg-gray-100 focus:ring-1 focus:outline-none focus:ring focus:ring-[#84bed1]`}
                    htmlFor={`img${id}`}>
                    {loading ? 'Atualizando ...' : `Selecionar imagem`}
                </label>
                <input
                    className='bottom-0 absolute hidden'
                    type="file"
                    id={`img${id}`}
                    accept="image/*"
                    onChange={onUpload}
                    disabled={loading}
                />
            </div>
        </div>
    )
}
