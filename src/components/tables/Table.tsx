type TableProps = {
    header?: string[]
    content?: TableContentProps[][]
    pathToEdit?: string
    onClick?: (path: string) => void
}

export type TableContentProps = {
    text: string
    className?: string
}

function Table({ header, content, pathToEdit = '/', onClick = () => { } }: TableProps) {

    return (
        <table className="w-full divide-y divide-gray-200 text-center rounded-lg">
            <thead className="bg-gray-50 rounded-t-lg">
                <tr>
                    {header && header.map((title, indexTitle) => (
                        <th
                            key={indexTitle}
                            scope="col"
                            className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                        >
                            {title}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="cursor-pointer overflow-x-hidden bg-white divide-y divide-gray-200">
                {content && content.map((line, indexLine) => (
                    <tr
                        key={indexLine}
                        onClick={() => onClick(pathToEdit + line[0].text)}
                        className={'hover:bg-gray-50'}>
                        {line && line.map((cell, indexCell) => (
                            <td
                                key={indexCell}
                                className={`px-1 md:px-1.5 lg:px-3 py-4 text-left ${cell.className}`}
                            >
                                {cell.text}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
export default Table