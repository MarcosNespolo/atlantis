import Image from "next/image";

export default function Loading() {
    return (
        <div className="w-full h-screen relative flex items-center justify-center">
            <div className="h-full w-full flex items-center justify-center">
                <Image src={'/circleLoading.svg'} width="64" height="64" alt={''} />
            </div>
        </div>
    )
}