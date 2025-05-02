import { PaletteButtonStyles } from "./paletteStyles";

type PaletteButtonProps = {
    color: string
    index: number
    isFirst: boolean
    isLast: boolean
    isLabelVisible: boolean
    onClick: (e: React.MouseEvent<HTMLButtonElement>, index: number, color: string) => void
};

const PaletteButton = ({ color, index, isFirst, isLast, isLabelVisible, onClick }: PaletteButtonProps) => {
    const classes = PaletteButtonStyles({ color })

    return (
        <button
            key={index}
            className={`${classes.button} ${isFirst ? classes.first : ''} ${isLast ? classes.last : ''}`}
            title={color}
            onClick={(e) => onClick(e, index, color)}
        >
            <span className={classes.label} style={{ opacity: isLabelVisible ? 0 : undefined }}>
                COPY
            </span>
        </button>
    )
}

export default PaletteButton;
