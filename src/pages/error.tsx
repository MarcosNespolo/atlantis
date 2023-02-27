export default function PageError() {
    return (
        <div className="w-full h-screen relative flex items-center justify-center">
            <div className="p-12 w-96 h-72 flex flex-col gap-2 text-center items-center text-primary-medium justify-center">
                <span className="text-6xl">
                    Ops... 
                </span>
                <span className="text-2xl font-semibold">
                    Algo deu errado, tente novamente mais tarde.
                </span>
            </div>
        </div>
    )
}