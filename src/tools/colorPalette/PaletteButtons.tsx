const PaletteButtons = ({ colors }: { colors: string[] }) => {
    const buttons = colors.map((color, index) => {
        const isFirst = index === 0
        const isLast = index === colors.length - 1

        const cornerClass = `
            ${isFirst ? 'rounded-bl-lg' : ''}
            ${isLast ? 'rounded-br-lg' : ''}
        `

        return (
            <button
                key={index}
                className={`w-[120px] h-[100px] relative group transition-transform overflow-hidden ${cornerClass}`}
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => navigator.clipboard.writeText(color)}
            >
                <span className="absolute -inset-[1px] flex font-sans font-semibold items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm bg-black/15 rounded">
                    COPY
                </span>
            </button>
        )
    })

    return <div className="flex overflow-hidden rounded-b-lg">{buttons}</div>
}

export default PaletteButtons