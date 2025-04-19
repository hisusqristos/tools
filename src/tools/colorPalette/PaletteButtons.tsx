const PaletteButtons = ({ colors }: { colors: string[] }) => {
    const buttons = colors.map((color, index) => (
        <button
            key={index}
            className="w-[120px] h-[100px] border border-black/10 relative group transition-transform shadow hover:shadow-md"
            style={{ backgroundColor: color }}
            title={color}
            onClick={() => navigator.clipboard.writeText(color)}
        >
            <span className="absolute inset-0 flex font-sans items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm bg-black/40 rounded">
                COPY
            </span>
        </button>
    ))

    return <div className="flex">{buttons}</div>
}

export default PaletteButtons